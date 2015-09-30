import { Router } from 'express'
import bodyParser from 'body-parser'

export default function apiify(obj) {
	return Router()

	.post('/:fn', bodyParser.json(), async function (req, res) {
		let fn = req.params.fn
		let args = req.body
		if (!Array.isArray(args))
			args = [ args ]

		try {
			if (fn in obj && typeof obj[fn] == 'function') {
				let result = await obj[fn](...args)
				res.json(result)
			} else
				throw new Error('Function \'' + fn + '\' not found in API: ' + req.originalUrl)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	})

	.get('/', function(req, res) {
		let fns = []
		for (let mbr in obj) {
			if (typeof obj[mbr] == 'function')
				fns.push(mbr)
		}
		res.json(fns)
	})
}
