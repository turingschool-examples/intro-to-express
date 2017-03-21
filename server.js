const express = require('express')
const app = express()
const bodyParser = require('body-parser')

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

app.post('/api/secrets', (request, response) => {
  const id = Date.now()
  const message = request.body.message
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

app.get('/api/secrets/:id', (request, response) => {
  const id = request.params.id
  const message = app.locals.secrets[id]

  if (!message) {
    return response.sendStatus(404)
  }
  response.json({
    id, message
  })
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
