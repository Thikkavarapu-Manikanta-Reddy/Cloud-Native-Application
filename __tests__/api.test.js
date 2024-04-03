// Reference: https://jestjs.io/docs/mock-function-api#mockfnmockimplementationfn

const request = require("supertest")
const app = require('../index')
const sequelize = require('../models/index');
const User = require('../models/User_model');

console.log("User Model", User);

jest.mock('../models/index', () => {
    const Sequelize = require("sequelize-mock");
    const sequelizeMock = new Sequelize();
    sequelizeMock.sync = jest.fn();
    sequelizeMock.authenticate = jest.fn();
    sequelizeMock.sync.mockImplementation(()=> {return Promise.resolve()})

    return sequelizeMock; 
});


jest.mock('../models/User_model', () => () => {
  const Sequelize = require("sequelize-mock");
  const sequelizeMock = new Sequelize();
  return sequelizeMock.define('User',  {
    id: 1,
    first_name: 'John',
    last_name: 'Smith',
    password: "VerySecurePassword!",
    username: 'testuser@gmail.com'
  })
});

describe("health check for /healthz", () => {
    
    beforeEach(async () => {
        
        sequelize.authenticate.mockImplementation(()=>{return Promise.resolve()});
        
      })
    
    it("should pass when database is connected", async () => {
        sequelize.authenticate.mockImplementation(()=>{return Promise.resolve()});

        const response = await request(app).get('/healthz');
        expect(response.status).toBe(200);
        expect(response.body).toBe("")
    });

    it("should throw error when database connection fails", async () => {
        sequelize.authenticate.mockRejectedValue(new Error());

        const response = await request(app).get('/healthz');
        expect(response.status).toBe(503);
    });

    it("should not accept body and throw error", async () => {
        return request(app)
            .get("/healthz")
            .send({"payload":"data"})
            .expect(400)
    });

    it('should not allow request with query parameters and throw error', async () => {
        const response = await request(app).get('/healthz?key=value');
        expect(response.status).toBe(400);
    });
});
