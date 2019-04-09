import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import constants from './constants';

const {
  johnAccountNumber, doeAccountNumber, nonExistingAccountNumber, defaultAdmin, defaultCashier,
} = constants;


chai.use(chaiHttp);
chai.should();


describe('Admin routes', () => {
  let BearerToken;
  before(() => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(defaultAdmin)
      .end((err, res) => {
        const { token } = res.body.data;
        if (token) {
          BearerToken = `Bearer ${token}`;
        }
      });
  });

  describe('Activate and deactivate', () => {
    it('Should return authentication error with 401', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/accounts/${johnAccountNumber}`)
        .send({
          status: 'dormant',
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return invalid status field', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/accounts/${johnAccountNumber}`)
        .send({
          status: '',
        })
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return success with status 200', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/accounts/${johnAccountNumber}`)
        .send({
          status: 'dormant',
        })
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.have.property('accountNumber');
          res.body.data.should.have.property('status').eql('dormant');
          done();
        });
    });

    it('Should return account number error with 404', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/accounts/${nonExistingAccountNumber}`)
        .send({
          status: 'dormant',
        })
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe('Delete account', () => {
    it('Should return authorization failed with status 401', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/accounts/${johnAccountNumber}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return account not found error with status 404', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/accounts/${nonExistingAccountNumber}`)
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return success with status code 200', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/accounts/${johnAccountNumber}`)
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          done();
        });
    });
  });
});

describe('Cashier routes', () => {
  let BearerToken;
  before(() => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(defaultCashier)
      .end((err, res) => {
        const { token } = res.body.data;
        if (token) {
          BearerToken = `Bearer ${token}`;
        }
      });
  });

  describe('Debit account', () => {
    it('Should return an authentication error with 401', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${doeAccountNumber}/debit`)
        .send({
          type: 'debit',
          amount: 500,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return a validation failed error with status 400', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${doeAccountNumber}/debit`)
        .send({})
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return account not found error with status 404', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${nonExistingAccountNumber}/debit`)
        .send({
          type: 'debit',
          amount: 500,
        })
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return insufficient funds with status 409', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${doeAccountNumber}/debit`)
        .send({
          type: 'debit',
          amount: 10000000000,
        })
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return success message with status 201', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${doeAccountNumber}/debit`)
        .send({
          type: 'debit',
          amount: 500,
        })
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.have.property('accountNumber').eql(doeAccountNumber);
          res.body.data.should.have.property('amount').eql(500);
          res.body.data.should.have.property('type').eql('debit');
          res.body.data.should.have.property('newBalance');
          done();
        });
    });
  });

  describe('Credit account', () => {
    it('Should return an authentication error with 401', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${doeAccountNumber}/credit`)
        .send({
          type: 'credit',
          amount: 500,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return a validation failed error with status 400', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${doeAccountNumber}/credit`)
        .send({})
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return account not found error with status 404', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${nonExistingAccountNumber}/credit`)
        .send({
          type: 'credit',
          amount: 500,
        })
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should return success message with status 201', (done) => {
      chai
        .request(app)
        .post(`/api/v1/transactions/${doeAccountNumber}/credit`)
        .send({
          type: 'credit',
          amount: 500,
        })
        .set('authorization', BearerToken)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.have.property('accountNumber').eql(doeAccountNumber);
          res.body.data.should.have.property('amount').eql(500);
          res.body.data.should.have.property('type').eql('credit');
          res.body.data.should.have.property('newBalance');
          done();
        });
    });
  });
});
