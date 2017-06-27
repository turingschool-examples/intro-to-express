var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'
app.locals.secrets = {
  wowowow: 'I am a banana',
  900: 'I am a pineapple'
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(request, response) {
  response.send(app.locals.title)
})

app.post('/api/secrets', function(request, response) {
  var id = Date.now()
  var message = request.body.message
  if (!message) {
    return response.status(422).send({
      error: 'No message property provided'
    })
  }
  app.locals.secrets[id] = message
  response.status(201).json({
    id, message
  })
})

app.get('/api/secrets/:id', function(request, response) {
  var id = request.params.id
  var message = app.locals.secrets[id]

  if (!message) {
    return response.sendStatus(404)
  }
  response.json({
    id, message
  })
})

if (!module.parent) {
  app.listen(app.get('port'), function() {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
