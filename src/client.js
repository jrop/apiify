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

export default async function apiClient(base) {
	function invoke(nm, ...args) {
		return xhr('POST', base + '/' + nm, args)
	}

	let fns = await xhr('GET', base)
	for (let f of fns) {
		invoke[f] = function(...args) {
			return invoke(f, ...args)
		}
	}

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
