import { Router } from 'express'
import bodyParser from 'body-parser'

//
// Take 'obj', and return the sub-object specified by 'path' (dot-notation)
// ex: jPath({ x: { y: 1 } }, 'x.y') => 1
//
function jPath(obj, path) {
	path = path.split('.').filter(part => part != '')

	try {
		let curr = obj
		for (let part of path) {
			curr = curr[part]
		}
		return curr
	} catch (e) {
		return undefined
	}
}

//
// Returns the array of functions defined in 'obj'
// if there are functions in a sub-objects 'obj.x',
// then that array entry looks like { x: [...array of functions...] }
//
function jDir(obj) {
	let fns = []
	for (let mbr in obj) {
		switch (typeof obj[mbr]) {
		case 'function':
			fns.push(mbr)
			break
		case 'object':
			let subDir = jDir(obj[mbr])
			if (subDir)
				fns.push({ [mbr]: subDir })
			break
		}
	}
	return fns.length == 0 ? undefined : fns
}

export default function apiify(obj) {
	let spec = jDir(obj)

	return Router()

	.post('/:fn', bodyParser.json(), async function (req, res) {
		let fn = jPath(obj, req.params.fn)
		let args = req.body
		if (!Array.isArray(args))
			args = [ args ]

		try {
			if (typeof fn == 'function') {
				let result = await fn(...args)
				res.json(result)
			} else
				throw new Error('Function \'' + fn + '\' not found in API: ' + req.originalUrl)
		} catch (e) {
			res.status(500).json({ error: e.message })
		}
	})

	.get('/', function(req, res) {
		res.json(spec)
	})
}
