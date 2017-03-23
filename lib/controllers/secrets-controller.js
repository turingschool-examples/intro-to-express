const Secret = require('../models/secret')

function create(request, response) {
  const created_at = new Date
  const message = request.body.message
  if (!message) {
    return response.status(422).send({
      error: 'No message property provided'
    })
  }
  Secret.createSecret(message).then((data) => {
    let newSecret = data.rows[0]
    response.status(201).json(newSecret)
  })
}

function show(request, response) {
  Secret.find(request.params.id)
  .then((data) => {
    if (!data.rowCount) {
      return response.sendStatus(404)
    }
    response.json(data.rows[0])
  })
}

module.exports = {
  create: create,
  show: show
}
