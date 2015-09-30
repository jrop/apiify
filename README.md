API-ify
=======

This helper library lets you easily create express-driven APIs that you can call easily on the client side.  For example, on the server you create the code to be API-ified (this sample is written in ES6/7: it makes use of ES7's `async`/`await` functionality):

```
import apiify from 'apiify'
import express from 'express'

let app = express()
app.use('/api', apiify({
  sayHello(name = 'World') {
    return 'Hello ' + name
  },

  delayed() {
    return Promise((yes, no) => {
        setTimeout(() => yes('All done')), 1000)
    })
  }
}))

app.get('/', (req, res) => res.end('My other route...'))
app.listen(/* some port */)
```

Then, in the client JS, you create an API-client (in this case with a base-URL of '/api'), and it will automatically expose the methods in an object:

```
import apiClient from 'apiify/client'

window.onload = async function() {
  let api = await apiClient('/api')

  //
  // now I can call API-methods in a few forms:
  //
  // 1)
  let helloDevelopers = await api('sayHello', 'developers!')
  //
  // 2)
  let helloDevelopers2 = await api.sayHello('developers!')
  //
  // 3)
  let allDone = await api.delayed()
}
```

Installing
==========

```
npm install apiify
```

API of apiify (server-module)
=============================

The apiify server-side library has one, default export with the following signature:

```
function apiify(methods) : express.Router
```

Where `methods` is a dictionary (object) of functions.  Functions in this dictionary may (if chosen) return promises (if they're asynchronous in nature).

API of apiify/client (browser-module)
=====================================

For this release, the only way to use this module is to `require` it in (e.g., you will need to use a tool like Webpack/browserify/etc. to bundle it with your app).  It exports one function with the following signature:

```
async apiClient(baseUrl) : ApiClient
```

`baseUrl` is the base-url to use when making requests

The `ApiClient` that this returns also sets convenience methods: one for each method that is defined on the server.  That is, if the server defines an API with a method named `sayHello(...)`, then the `ApiClient` returned by this method will have a method like:

```
async function sayHello(...) {...}
```

Which will automatically call the one on the server-side, passing parameters through the request.

## ApiClient

An `ApiClient` is a function with the following signature:

```
async function(methodName, ...args) : Any
```

License
=======

Copyright (c) 2015, Jonathan Apodaca
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
