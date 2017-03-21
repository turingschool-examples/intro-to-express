const assert = require('chai').assert
const app = require('../server')
const request = require('request')

describe('Server', () => {
  before((done) => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result) => {
      if (err) { done(err) }
      done()
    })

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(() => {
    this.server.close()
  })

  it('should exist', () => {
    assert(app)
  })
  describe('POST /api/secrets', () => {
    beforeEach(() => {
      app.locals.secrets = {}
    })

    it('should not return a 404', (done) => {
      this.request.post('/api/secrets', (error, response) => {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('should receive and store data', (done) => {
      const message = { message: 'I like pineapples' }
      this.request.post('/api/secrets', { form: message }, (error, response) => {
        if (error) { done(error) }
        const secretCount = Object.keys(app.locals.secrets).length
        assert.equal(secretCount, 1)
        done()
      })
    })
  })

  describe('GET /api/secrets/:id', () => {
    beforeEach(() => {
      app.locals.secrets = {
        horse: 'Penelope'
      }
    })

    it('should return 404 if resource is not found', (done) => {
      this.request.get('/api/secrets/laszlo', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('should return the id and message from the resource found', (done) => {
      this.request.get('/api/secrets/horse', (error, response) => {
        const id = Object.keys(app.locals.secrets)[0]
        const message = app.locals.secrets[id]
        if (error) { done(error) }
        assert.include(response.body, id)
        assert.include(response.body, message)
        done()
      })
    })
  })

  describe('GET /', () => {
    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('returns the app title', (done) => {
      this.request.get('/', (error, response) => {
        const title = app.locals.title
        if (error) { done(error) }
        assert.include(response.body, title)
        done()
      })
    })
  })
})
