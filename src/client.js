//
// creates an object-based API based on the passed in 'spec'
// for each leaf in the spec, attache a function returned by the makeMethodClientFactory
// spec follows the structure of jDir found in index.js
//
function makeFromSpec(spec, makeMethodClientFactory, currObj = '') {
	let api = { }
	for (let fn of spec) {
		let t = typeof fn
		switch (t) {
		case 'string':
			let fnPath = currObj == '' ? fn : currObj + '.' + fn
			api[fn] = makeMethodClientFactory(fnPath)
			break
		case 'object':
			for (let mbr in fn) {
				let objPath = currObj == '' ? mbr : currObj + '.' + mbr
				api[mbr] = makeFromSpec(fn[mbr], makeMethodClientFactory, objPath)
			}
			break
		}
	}
	return api
}

//
// Promise XHR
//
function xhr(method, url, data) {
	return new Promise((yes, no) => {
		let xhr = new XMLHttpRequest()
		xhr.open(method, url, true)

		if (method == 'POST') {
			xhr.setRequestHeader('Content-type', 'application/json')
			xhr.send(data ? JSON.stringify(data) : undefined)
		} else
			xhr.send()

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4)
				if (xhr.status == 200) {
					try {
						yes(JSON.parse(xhr.responseText))
					} catch (e) {
						no({ error: 'Invalid data recieved from API call: ' + url })
					}
				} else {
					let err = { status: xhr.status, error: xhr.responseText }
					try { err = JSON.parse(xhr.responseText) } catch (e) { }
					no(err)
				}
		}
	})
}

//
// This function creates the API
//
export default async function apiClient(base) {
	function invoke(nm, ...args) {
		return xhr('POST', base + '/' + nm, args)
	}

	let spec = await xhr('GET', base)
	let api = makeFromSpec(spec, function(fn) {
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
