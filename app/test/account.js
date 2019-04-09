import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

chai.use(chaiHttp);
chai.should();

const defaultUser = {
  email: 'user@gmail.com',
  password: 'user',
};

describe('Accounts', () => {
  let BearerToken;
  before(() => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(defaultUser)
      .end((err, res) => {
        const { token } = res.body.data;
        if (token) {
          BearerToken = `Bearer ${token}`;
        }
      });
  });

  it('Should return authentication error with status 401', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'currents',
        status: 'active',
        openingBalance: 50000,
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('message');
        done();
      });
  });

  it('Should return validation error with status 400', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({})
      .set('authorization', BearerToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should return success message with status 201', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'current',
        status: 'active',
        openingBalance: 50000,
      })
      .set('authorization', BearerToken)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('data');
        res.body.data.should.have.property('accountNumber');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('type').eql('current');
        res.body.data.should.have.property('openingBalance').eql(50000);
        done();
      });
  });


  it('Should return account already exist error with status 409', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        type: 'currents',
        status: 'active',
        openingBalance: 50000,
      })
      .set('authorization', BearerToken)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.have.property('message');
        done();
      });
  });
});
