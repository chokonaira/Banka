import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';
import constants from '../constants';

chai.use(chaiHttp);
chai.should();

let adminBearerToken;
let cashierBearerToken;

describe('Admin', function () {
  this.timeout(0);
  before(async () => {
    // login admin
    const adminRes = await chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: constants.testAdmin.email,
        password: constants.testAdmin.password,
      });
    const { token: adminToken } = adminRes.body.data;
    adminBearerToken = `Bearer ${adminToken}`;
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

  describe('Activate or deactivate an account', () => {
    it('Should return token not provided error with status 401', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
        .send({
          status: 'dormant',
        });
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('Token not Provided');
    });

    it('Should return jwt error for invalid signature with status 401', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
        .send({
          status: 'dormant',
        })
        .set('authorization', constants.invalidToken);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.error.should.equal('invalid signature');
    });

    it('Should return input status is required error with status 422', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
        .send({})
        .set('authorization', adminBearerToken);
      res.should.have.status(422);
      res.body.should.have.property('error');
      res.body.error.should.equal('"status" is required');
    });

    it('Should return invalid account number with status 400', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/accounts/${constants.invalidAccountNumber}`)
        .send({
          status: 'dormant',
        })
        .set('authorization', adminBearerToken);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Invalid account number');
    });

    it('Should return invalid account status field with status 400', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
        .send({
          status: 'notactive',
        })
        .set('authorization', adminBearerToken);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.equal('Account status can only be Active or Dormant');
    });

    it('Should return account does not exist with status 404', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/accounts/123445678')
        .send({
          status: 'dormant',
        })
        .set('authorization', adminBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('No account found');
    });

    it('Should return account updated successfully with account data and status 200', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
        .send({
          status: 'dormant',
        })
        .set('authorization', adminBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('data');
      res.body.data.should.have.property('account_id');
      res.body.data.should.have.property('accountno');
      res.body.data.should.have.property('createdon');
      res.body.data.should.have.property('owner');
      res.body.data.should.have.property('status').eq('dormant');
      res.body.data.should.have.property('type').eql('saving');
      res.body.data.should.have.property('openingbalance').eql('5000');
    });
  });

  describe('get all bank accounts', () => {
    it('Should return all bank accounts with status 200', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/accounts')
        .set('authorization', adminBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('data');
    });

    it('Should return all dormant bank accounts with status 200', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/accounts?status=dormant')
        .set('authorization', adminBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('data');
    });

    it('Should return all active bank accounts with status 200', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/accounts?status=active')
        .set('authorization', adminBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('data');
    });
  });

  describe('get a specific user accounts', () => {
    it('Should return no account found with status 404', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/user/${constants.invalidEmail}/accounts`)
        .set('authorization', adminBearerToken);
      res.should.have.status(404);
      res.body.should.have.property('message');
      res.body.message.should.equal('Account does not exist!');
    });

    it('Should return all the user\'s bank accounts with status 200', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/user/${constants.validEmail}/accounts`)
        .set('authorization', adminBearerToken);
      res.should.have.status(200);
      res.body.should.have.property('data');
    });
  });
});