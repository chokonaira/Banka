import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

chai.use(chaiHttp);
chai.should();

const firstname = 'Lorem';
const lastname = 'Ipsum';
const email = 'lorem@gmail.com';
const existingUserEmail = 'admin@gmail.com';
const nonExistingUserEmail = 'john@gamil.com';
const type = 'User';
const password = 'password';
const existingPassword = 'admin';
const wrongPassword = 'wrongPassword';
const isAdmin = false;

describe('Users routes', () => {
  describe('Signup', () => {
    it('Should return a validation failed error 400', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstname,
          lastname,
          type,
          password,
          isAdmin,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('Should return user data with status 201 for success', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstname,
          lastname,
          email,
          type,
          password,
          isAdmin,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('firstname');
          res.body.data.should.have.property('lastname');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('type');
          done();
        });
    });

    it('Should return a user exist error with status 409', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstname,
          lastname,
          email: existingUserEmail,
          type,
          password: existingPassword,
          isAdmin,
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe('Login', () => {
    it('Should return a validation failed error with status 400', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });


    it('Should return login success with status 200', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: existingUserEmail,
          password: existingPassword,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('firstname');
          res.body.data.should.have.property('lastname');
          res.body.data.should.have.property('email');
          done();
        });
    });


    it('Should return user not found with status 404', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: nonExistingUserEmail,
          password,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return login error with satus 404', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          email: existingUserEmail,
          password: wrongPassword,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });
});


// describe('Accounts', () => {
//   // test post create account route
//   // it should respond with status 401 and relevant error message
//   it('respond with 401', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/accounts')
//       .send({
//         type: 'currents'
//       })
//       .end((err, res) => {
//         res.should.have.status(401);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // it should respond with status 400 and relevant error message
//   it('respond with 400', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/accounts')
//       .send({
//         type: 'currents'
//       })
//       .set("x-access-token", process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property("error");
//         done();
//       });
//   });

//   // it should respond with status 200
//   it('respond with 200', done => {
//     chai
//       .request(app)
//       .post('/api/v1/accounts')
//       .send({
//         type: 'current',
//         owner: 2
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         accountNumber = res.body.data.accountNumber;
//         res.should.have.status(200);
//         res.body.should.have.property('data');
//         res.body.data.should.have.property('accountNumber');
//         res.body.data.should.have.property('firstname');
//         res.body.data.should.have.property('lastname');
//         res.body.data.should.have.property('type').eql('current');
//         res.body.data.should.have.property('openingBalance').eql(0);
//         done();
//       });
//   });


//   // it should respond with status 400 and relevant error message
//   it('respond with 409', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/accounts')
//       .send({
//         type: 'savings',
//         owner: 1
//       })
//       .set("x-access-token", process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(409);
//         res.body.should.have.property("error");
//         done();
//       });
//   });

//   // testing activate or deactivate account route
//   // it should respond with status 401 and relevant error message
//   it('respond with 401 for activate', (done) => {
//     chai
//       .request(app)
//       .patch(`/api/v1/accounts/${accountNumber}`)
//       .send({
//         status: 'dormant'
//       })
//       .end((err, res) => {
//         res.should.have.status(401);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // it should respond with status 400 and relevant error message
//   it("respond with 400 for activate", done => {
//     chai
//       .request(app)
//       .patch(`/api/v1/accounts/${accountNumber}`)
//       .send({
//         status: 'front'
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // it should respond with status 200
//   it("respond with 200 for activate", done => {
//     chai
//       .request(app)
//       .patch(`/api/v1/accounts/${3451585830}`)
//       .send({
//         status: 'dormant'
//       })
//       .set("x-access-token", process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property("data");
//         res.body.data.should.have.property("accountNumber");
//         res.body.data.should.have.property("status").eql("dormant");
//         done();
//       });
//   });


//   // it should respond with status 404 and relevant error message
//   it('respond with 404 for activate', (done) => {
//     chai
//       .request(app)
//       .patch(`/api/v1/accounts/${accountNumberError}`)
//       .send({
//         status: 'dormant'
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(404);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // debit account route tests
//   // if token is not in the head return 401
//   it('return 401 if no token', (done) => {
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585830}/debit`)
//       .send({
//         cashier: 2
//       })
//       .end((err, res)=>{
//         res.should.have.status(401);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // if the fields are not filled
//   it('return 400 for empty field',(done)=>{
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585830}/debit`)
//       .send({
//         cashier: 2
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err,res) => {
//         res.should.have.status(400);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // if account not found
//   it('should return 404 if the account is not found', (done) => {
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585831}/debit`)
//       .send({
//         amount: 4000,
//         cashier: 2
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(404);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // return 409 if funds are insufficient
//   it('should return 409 if balance is insufficient', (done) => {
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585830}/debit`)
//       .send({
//         amount: 10000000000,
//         cashier: 2
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(409);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // return 200 status and data
//   it('should return 200 and data', (done) => {
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585830}/debit`)
//       .send({
//         amount: 1000,
//         cashier: 2
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property('data');
//         res.body.data.should.have.property('transactionId');
//         res.body.data.should.have.property('accountNumber').eql(3451585830);
//         res.body.data.should.have.property('amount').eql(1000);
//         res.body.data.should.have.property('cashier').eql(2);
//         res.body.data.should.have.property('transactionType').eql('debit');
//         res.body.data.should.have.property('accountBalance');
//         done();
//       })
//   });

//   // test the credit route
//   // return 401 if no token
//   it('should return 401 if unauthorised', (done) => {
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585830}/credit`)
//       .end((err, res) => {
//         res.should.have.status(401);
//         res.body.should.have.property("error");
//         done();
//       });
//   });

//   // return 400 if no input
//   it('should return 400 if no field', (done) => {
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585830}/credit`)
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(400);
//         res.body.should.have.property("error");
//         done();
//       });
//   });

//   // if account not found
//   it('should return 404 if the account is not found', (done) => {
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585831}/credit`)
//       .send({
//         amount: 4000,
//         cashier: 2
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(404);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // return 200 status and data
//   it('should return 200 and data', (done) => {
//     chai
//       .request(app)
//       .post(`/api/v1/transactions/${3451585830}/credit`)
//       .send({
//         amount: 1000,
//         cashier: 2
//       })
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property('data');
//         res.body.data.should.have.property('transactionId');
//         res.body.data.should.have.property('accountNumber').eql(3451585830);
//         res.body.data.should.have.property('amount').eql(1000);
//         res.body.data.should.have.property('cashier').eql(2);
//         res.body.data.should.have.property('transactionType').eql('credit');
//         res.body.data.should.have.property('accountBalance');
//         done();
//       });
//   });

//   // get a single account detail
//   // should return 401 if no token
//   it('should return 401 if account not found', (done) => {
//     chai
//       .request(app)
//       .get(`/api/v1/accounts/${0}`)
//       .end((err, res) => {
//         res.should.have.status(401);
//         res.body.should.have.property('error');
//         done();
//       })
//   });

//   // should return 200 if found
//   it('should return 200 if account not found', (done) => {
//     chai
//       .request(app)
//       .get(`/api/v1/accounts/${1}`)
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property('data');
//         res.body.data.should.have.property('accountName');
//         res.body.data.should.have.property("accountNumber").eql(3451585830);
//         res.body.data.should.have.property('accountStatus');
//         res.body.data.should.have.property('accountBalance').eql(900000);
//         res.body.data.should.have.property('accountType');
//         res.body.data.should.have.property('openingDate');
//         done();
//       })
//   });

//   // should return 404 if account is not found
//   it('should return 404 if account not found', (done) => {
//     chai
//       .request(app)
//       .get(`/api/v1/accounts/${3}`)
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(404);
//         res.body.should.have.property('error');
//         done();
//       })
//   });

//   // get all transactions of a specific account
//   // if no token
//   it('should return 401 if token is not found in the header1', (done)=>{
//     chai
//       .request(app)
//       .get(`/api/v1/transactions/${476780976987}`)
//       .end((err, res) => {
//         res.should.have.status(401);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // if no transaction is found for the account
//   it('should return 404 if no transaction is found for that account', (done) => {
//     chai
//       .request(app)
//       .get(`/api/v1/transactions/${9943588812}`)
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(404);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // it should return a status 200
//   it('should return with a status of 200 if transaction found', (done) => {
//     chai
//       .request(app)
//       .get(`/api/v1/transactions/${3451585830}`)
//       .set('x-access-token', process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property('data');
//         res.body.data[0].should.have.property('accountNumber').eql(3451585830);
//         done();
//       });
//   });

//   // the delete route tests
//   // should return 401 if no token
//   it('should return 401 if  no token', (done) => {
//     chai
//       .request(app)
//       .delete(`/api/v1/accounts/${657465784689}`)
//       .end((err, res) => {
//         res.should.have.status(401);
//         res.body.should.have.property('error');
//         done();
//       });
//   });

//   // should respond with 404
//   it('should respond with 404 if account is not found', (done) => {
//     chai
//       .request(app)
//       .delete(`/api/v1/accounts/${657465784689}`)
//       .set("x-access-token", process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(404);
//         res.body.should.have.property("error");
//         done();
//       });
//   });

//   // respond with status 200
//   it('should respond with 200 if it is successful', (done) => {
//     chai
//       .request(app)
//       .delete(`/api/v1/accounts/${3451585830}`)
//       .set("x-access-token", process.env.TEST_TOKEN)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property("message");
//         done();
//       });
//   });
// });
