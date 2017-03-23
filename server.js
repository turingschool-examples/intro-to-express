const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Secret = require('./lib/models/secret');
const SecretsController = require('./lib/controllers/secrets-controller')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'
app.locals.secrets = {
  wowowow: 'I am a banana',
  900: 'I am a pineapple'
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, response) => {
  response.end(app.locals.title)
})

app.post('/api/secrets', SecretsController.create)
app.get('/api/secrets/:id', SecretsController.show)

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
