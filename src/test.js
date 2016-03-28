import apiify from './index'
import express from 'express'

let app = express()

app.use('/api', apiify({
	version: 1.0,

	sayHello() {
		return 'hey there'
	},

	admin: {
		sayHello() {
			return 'hey admin'
		}
	}
}))

app.get('/', (req, res) => res.end(`
<!DOCTYPE html>
<head>
<script src="/client.js"></script>
<script>
apiify.client('/api')
.then(api => {
	console.log(api)
	api.sayHello()
	.then(msg => console.log(msg))
	.then(() => api.admin.sayHello())
	.then(msg => console.log(msg))
})
</script>
</head>
`))

app.get('/client.js', (req, res) => res.sendFile(__dirname + '/client.js'))

app.listen(1111)
