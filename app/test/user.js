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

    
  });
});


