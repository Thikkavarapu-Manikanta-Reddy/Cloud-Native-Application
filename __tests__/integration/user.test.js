const request = require("supertest")
const app = require("../../index")
const sequelize = require("../../models/index")
const User = require("../../models/User_model")
const EmailLog = require("../../models/EmailLog")

describe('/v1/user Integration Tests', () => {
    const testUser = {
        first_name: 'John',
        last_name: 'Smith',
        password: "VerySecurePassword!",
        username: 'sriyap@gmail.com'
    };
    let basicAuthHeader;
    let verificationCode;

    beforeAll( async() => {
        await sequelize.sync({ force: true });
        await request(app)
            .post('/v1/user')
            .send(testUser)
            .expect(201);
        
        const userCredentials = Buffer.from(`${testUser.username}:${testUser.password}`).toString('base64');
        basicAuthHeader = `Basic ${userCredentials}`;
        const user = await User.findOne({ where: { username: testUser.username } });
        verificationCode = user.verifyCode;

        await EmailLog.create({email: user.username, email_sent: new Date()})
    });
  
    it('Test 1 - Create an account and validate it exists', async () => {
      
      await request(app)
        .get(`/v1/user/verify?token=${verificationCode}&email=${testUser.username}`)
        .expect(200);
  
      await request(app)
        .get('/v1/user/self')
        .set('Authorization', basicAuthHeader)
        .expect(200)
        .then((response) => {
          expect(response.body.username).toEqual(testUser.username);
        });
    });
  
    it('Test 2 - Update the account and validate the account was updated', async () => {

      const newName = 'Updated Name';
      await request(app)
        .put('/v1/user/self')
        .set('Authorization', basicAuthHeader)
        .send({ first_name: newName })
        .expect(204);
  
      await request(app)
        .get('/v1/user/self')
        .set('Authorization', basicAuthHeader)
        .expect(200)
        .then((response) => {
          expect(response.body.first_name).toEqual(newName);
        });
    });

    afterAll(()=>{
        sequelize.close();
    })
  });