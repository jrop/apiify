import xhr from 'xhr'

//
// creates an object-based API based on the passed in 'spec'
// for each leaf in the spec, attach a function returned by the makeMethodClientFactory
// spec follows the structure of jDir found in index.js
//
// example input: [ 'function1', { subObject: [ 'function2' ] }, 'function3' ]
//
// output: {
//	function1: makeMethodClientFactory('function1'),
//	subObject: {
// 		function2: makeMethodClientFactory('subObject.function1')
// 	},
// 	function2: makeMethodClientFactory('function2')
// }
//
function traverseApiSpec(spec, makeMethodClientFactory, currObj = '') {
	let api = { }
	for (let fn of spec) {
		let t = typeof fn
		switch (t) {
		case 'string':
			//
			// leaf
			//
			let fnPath = currObj == '' ? fn : currObj + '.' + fn
			api[fn] = makeMethodClientFactory(fnPath)
			break
		case 'object':
			//
			// loop over members and recurse
			//
			for (let mbr in fn) {
				let objPath = currObj == '' ? mbr : currObj + '.' + mbr
				api[mbr] = traverseApiSpec(fn[mbr], makeMethodClientFactory, objPath)
			}
			break
		}
	}
	return api
}

//
// Promise XHR
//
function xhrp(method, url, data) {
	return new Promise((yes, no) => {
		xhr({
			method: method,
			body: JSON.stringify(data),
			uri: url,
			headers: {
				'Content-Type': 'application/json'
			}
		}, (err, resp, body) => {
			if (err) return no(err)

			try {
				yes(JSON.parse(body))
			} catch (e) {
				no({ error: 'Invalid data recieved from API call: ' + url })
			}
		})
	})
}

//
// This function creates the API
//
export default async function apiClient(base) {
	function invoke(nm, ...args) {
		return xhrp('POST', base + '/' + nm, args)
	}

	let spec = await xhrp('GET', base)
	let api = traverseApiSpec(spec, function(fn) {
		return function(...args) {
			return invoke(fn, ...args)
		}
	})

	for (let mbr in api)
		invoke[mbr] = api[mbr]

	return invoke
}

//
// example:
// async function doStuff() {
// 	let apiClient = require('api-client')
// 	let myApi = await apiClient('/my-api')
// 	let result = await myApi.sayHelloWorld()
// 	console.log(result)
// }
//
