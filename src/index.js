import bodyParser from 'body-parser'
import flatten from 'flat'
import { Router } from 'express'

export default function apiify(obj) {
	let spec = flatten(obj)

	return Router()

	.post('/:fn', bodyParser.json(), async function (req, res) {
		let fn = spec[req.params.fn]
		let args = req.body
		if (!Array.isArray(args))
			args = [ args ]

		try {
			if (typeof fn == 'function') {
				let result = await fn(...args)
				res.json(result)
			} else
				throw new Error('Function \'' + req.params.fn + '\' not found in API: ' + req.originalUrl)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	})

	.get('/', function(req, res) {
		let mbrs = Object.keys(spec).filter(key => typeof spec[key] == 'function')
		res.json(mbrs)
	})
}
