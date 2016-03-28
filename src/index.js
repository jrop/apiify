import bodyParser from 'body-parser'
import flatten from 'flat'
import router from 'router'

export default function apiify(obj) {
	let spec = flatten(obj)

	return router()

	.post('/:fn', bodyParser.json(), function (req, res) {
		let fn = spec[req.params.fn]
		let args = req.body
		if (!Array.isArray(args))
			args = [ args ]

		function err(e) {
			res.status(500).json({ message: e.message })
		}

		if (typeof fn == 'function') {
			Promise.resolve(fn.apply(req, args))
			.then(function (result) {
				res.json(result)
			})
			.catch(err)
		} else
			err(new Error('Function \'' + req.params.fn + '\' not found in API: ' + req.originalUrl))
	})

	.get('/', function(req, res) {
		let mbrs = Object.keys(spec).filter(key => typeof spec[key] == 'function')
		res.json(mbrs)
	})
}
