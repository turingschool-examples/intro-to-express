var assert = require('chai').assert
var app = require('../server')
var request = require('request')

describe('Server', function() {
  before(function(done) {
    this.port = 9876;
    this.server = app.listen(this.port, function(err, result) {
      if (err) { done(err) }
      done()
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(function() {
    this.server.close()
  })

  it('should exist', function() {
    assert(app)
  })

  describe('POST /api/secrets', function() {
    beforeEach(function() {
      app.locals.secrets = {}
    })

    it('should not return a 404', function(done){
      this.request.post('/api/secrets', function(error, response) {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('should receive and store data', function(done) {
      var message = { message: 'I like pineapples' }
      this.request.post('/api/secrets', { form: message }, function(error, response) {
        if (error) { done(error) }
        var secretCount = Object.keys(app.locals.secrets).length
        assert.equal(secretCount, 1)
        done()
      })
    })
  })

  describe('GET /api/secrets/:id', function() {
    beforeEach(function() {
      app.locals.secrets = {
        horse: 'Penelope'
      }
    })

    it('should return 404 if resource is not found', function(done) {
      this.request.get('/api/secrets/laszlo', function(error, response) {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('should return the id and message from the resource found', function(done) {
      this.request.get('/api/secrets/horse', function(error, response) {
        var id = Object.keys(app.locals.secrets)[0]
        var message = app.locals.secrets[id]
        if (error) { done(error) }
        assert.include(response.body, id)
        assert.include(response.body, message)
        done()
      })
    })
  })

  describe('GET /', function() {
    it('should return a 200', function(done) {
      this.request.get('/', function(error, response) {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('returns the app title', function(done) {
      this.request.get('/', function(error, response) {
        var title = app.locals.title
        if (error) { done(error) }
        assert.include(response.body, title)
        done()
      })
    })
  })
})
