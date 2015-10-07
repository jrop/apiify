import { unflatten } from 'flat'
import xhr from 'xhr'

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
async function apiClient(base) {
	function invoke(nm, ...args) {
		return xhrp('POST', base + '/' + nm, args)
	}

	let spec = await xhrp('GET', base) // array of function names (like [ 'fn1', 'x.y.fn2', ... ])
	let methods = { }
	for (let fn of spec) {
		methods[fn] = function(...args) {
			return invoke(fn, ...args)
		}
	}
	// methods now looks like
	methods = unflatten(methods)

	for (let mbr in methods)
		invoke[mbr] = methods[mbr]

	return invoke
}
export default apiClient
export { apiClient }

try {
	window.apiify = { client: apiClient }
} catch (e) { }

//
// example:
// async function doStuff() {
// 	let apiClient = require('api-client')
// 	let myApi = await apiClient('/my-api')
// 	let result = await myApi.sayHelloWorld()
// 	console.log(result)
// }
//
