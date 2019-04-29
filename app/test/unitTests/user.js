import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';
import constants from '../constants';

chai.use(chaiHttp);
chai.should();

let userBearerToken;
let cashierBearerToken;

describe('User', function () {
  this.timeout(0);
  before('Login user to get access token', async () => {
    // login user
    const userRes = await chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: constants.testUser.email,
        password: constants.testUser.password,
      });
    const { token: userToken } = userRes.body.data;
    userBearerToken = `Bearer ${userToken}`;
    // login cashier
    const cashierRes = await chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: constants.testCashier.email,
        password: constants.testCashier.password,
      });
    const { token: cashierToken } = cashierRes.body.data;
    cashierBearerToken = `Bearer ${cashierToken}`;
  });

  describe('Create a bank account', () => {
    it('Should return token not provided error with status 401', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/accounts')
        .send(constants.newAccount);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('Token not Provided');
    });

    it('Should return jwt error for invalid signature with status 401', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/accounts')
        .send(constants.newAccount)
        .set('authorization', constants.invalidToken);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('invalid signature');
    });

    it('Should return input type is required error with status 422', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/accounts')
        .send({
          status: constants.newAccount.status,
          openingBalance: constants.newAccount.openingBalance,
        })
        .set('authorization', userBearerToken);
      res.should.have.status(422);
      res.body.should.have.property('error');
      res.body.error.should.equal('"type" is required');
    });

    it('Should return account created successfully with account data and status 201', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/accounts')
        .send(constants.newAccount)
        .set('authorization', userBearerToken);
      res.body;
      res.should.have.status(201);
      res.body.should.have.property('message');
      res.body.message.should.equal('Account created successfully');
      res.body.should.have.property('data');
      res.body.data.should.have.property('accountno');
      res.body.data.should.have.property('createdon');
      res.body.data.should.have.property('owner');
      res.body.data.should.have.property('type').eql('current');
      res.body.data.should.have.property('openingbalance').eql('50000');
    });

    it('Should return an authorization error with status 401', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/accounts')
        .send(constants.newAccount)
        .set('authorization', cashierBearerToken);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('Access denied');
    });
  });

  describe('Get all user transactions', () => {
    it('Should return invalid account number with status 400', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/accounts/${constants.invalidAccountNumber}/transactions`)
        .set('authorization', userBearerToken);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Invalid account number');
    });

    it('Should return token not provided error with status 401', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('Token not Provided');
    });

    it('Should return jwt error for invalid signature with status 401', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
        .set('authorization', constants.invalidToken);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('invalid signature');
    });

    it('Should return no tranactions for this account error with status 404', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/accounts/909090909/transactions')
        .set('authorization', userBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('No transaction performed yet');
    });

    it('Should return all trasactions and status 200', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
        .set('authorization', userBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('data');
      res.body.data.should.have.length(3);
    });

    it('Should return an authorization error with status 401', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
        .set('authorization', cashierBearerToken);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('Access denied');
    });
  });

  describe('Get a single transaction', () => {
    it('Should return transaction does not exist error with status 404', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/transactions/100000')
        .set('authorization', userBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('No transaction performed yet');
    });

    it('Should return all trasactions and status 200', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/transactions/1')
        .set('authorization', userBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('data');
    });
  });
});