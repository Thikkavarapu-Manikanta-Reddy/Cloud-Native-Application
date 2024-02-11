const supertest = require('supertest')
const app = require('./app')


describe('Testing our Application', function() {
    it('GET /healthz end point of the application', (done) => {
        supertest(app)
            .get('/healthz')
            .expect(200)
            .end((err, response) => {
                if (err) return done(err)
                return done()
            })
    })
    it('GET 404 API endpoint', (done) => {
        supertest(app)
            .get('/notfoundendpoint')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })
})