import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server'


chai.use(chaiHttp);
chai.should();

describe('demo', () => {
  it('This is a demo test', () => {
    ('demo').should.equal('demo');
  });
});