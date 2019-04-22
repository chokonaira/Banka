import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import constants from './constants'

chai.use(chaiHttp);
chai.should();

let userBearerToken;
let cashierBearerToken;
let adminBearerToken;

describe('Staff routes', function () {
    this.timeout(0)
    before(async () => {
        //login admin
        const adminRes = await chai.request(app)
            .post('/api/v1/auth/login')
            .send({
                email: constants.testAdmin.email,
                password: constants.testAdmin.password
            })
        const { token: adminToken } = adminRes.body.data;
        adminBearerToken = `Bearer ${adminToken}`;
        //login cashier
        const cashierRes = await chai.request(app)
            .post('/api/v1/auth/login')
            .send({
                email: constants.testCashier.email,
                password: constants.testCashier.password
            })
        const { token: cashierToken } = cashierRes.body.data;
        cashierBearerToken = `Bearer ${cashierToken}`;
    })

    describe('Activate or deactivate an account', () => {
        it('Should return token not provided error with status 401', async () => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
                .send({
                    status: 'dormant'
                })
            res.should.have.status(401);
            res.body.should.have.property('error');
            res.body.error.should.equal('Token not Provided');
        });

        it('Should return jwt error for invalid signature with status 401', async () => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
                .send({
                    status: 'dormant'
                })
                .set('authorization', constants.invalidToken)
            res.should.have.status(401);
            res.body.should.have.property('error');
            res.body.error.should.equal('invalid signature')
        });

        it('Should return input status is required error with status 422', async () => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
                .send({})
                .set('authorization', adminBearerToken)
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.error[0].should.equal('status is required');
        });

        it('Should return invalid account number with status 409', async () => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/accounts/${constants.invalidAccountNumber}`)
                .send({
                    status: 'dormant'
                })
                .set('authorization', adminBearerToken)
            res.should.have.status(409);
            res.body.should.have.property('error');
            res.body.error.should.equal('Invalid account number, account number must be 9 digits long');
        });

        it('Should return invalid account status field with status 409', async () => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
                .send({
                    status: 'notactive'
                })
                .set('authorization', adminBearerToken)
            res.should.have.status(409);
            res.body.should.have.property('error');
            res.body.error.should.equal('Invalid account status field, status should be "dormant" or "active"');
        });

        it('Should return account does not exist with status 404', async () => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/accounts/123445678`)
                .send({
                    status: 'dormant'
                })
                .set('authorization', adminBearerToken)
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Account does not exist');
        });

        it('Should return account updated successfully with account data and status 201', async () => {
            const res = await chai
                .request(app)
                .patch(`/api/v1/accounts/${constants.validAcccountNumber}`)
                .send({
                    status: 'dormant'
                })
                .set('authorization', adminBearerToken)
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

        describe('get all bank accounts', () => {
            it('Should return all bank accounts with status 200', async () => {
                const res = await chai
                    .request(app)
                    .get('/api/v1/accounts')
                    .set('authorization', adminBearerToken)
                res.should.have.status(200);
                res.body.should.have.property('data');
            });

            it('Should return all dormant bank accounts with status 200', async () => {
                const res = await chai
                    .request(app)
                    .get('/api/v1/accounts?status=dormant')
                    .set('authorization', adminBearerToken)
                res.should.have.status(200);
                res.body.should.have.property('data');
            });

            it('Should return all active bank accounts with status 200', async () => {
                const res = await chai
                    .request(app)
                    .get('/api/v1/accounts?status=active')
                    .set('authorization', adminBearerToken)
                res.should.have.status(200);
                res.body.should.have.property('data');
            });
        })

        describe('get a specific user accounts', () => {
            it('Should return no account found with status 404', async () => {
                const res = await chai
                    .request(app)
                    .get(`/api/v1/user/${constants.invalidEmail}/accounts`)
                    .set('authorization', adminBearerToken)
                res.should.have.status(404);
                res.body.should.have.property('message');
                res.body.message.should.equal('No account found for the selected user');
            });

            it('Should return all the user\'s bank accounts with status 200', async () => {
                const res = await chai
                    .request(app)
                    .get(`/api/v1/user/${constants.validEmail}/accounts`)
                    .set('authorization', adminBearerToken)
                res.should.have.status(200);
                res.body.should.have.property('data');
            });
            
        })
        //     it('Should return an authorization error with status 401', async () => {
        //       const res = await chai
        //         .request(app)
        //         .post('/api/v1/accounts')
        //         .send(constants.newAccount)
        //         .set('authorization', cashierBearerToken)
        //       res.should.have.status(401);
        //       res.body.should.have.property('error');
        //       res.body.error.should.equal('you must be a user to perform this task');
        //     });
        //   })

        //   describe('Get all user transactions', () => {
        //     it('Should return invalid account number with status 409', async () => {
        //       const res = await chai
        //         .request(app)
        //         .get(`/api/v1/accounts/${constants.invalidAccountNumber}/transactions`)
        //       res.should.have.status(409);
        //       res.body.should.have.property('error');
        //       res.body.error.should.equal('Invalid account number, account number must be 9 digits long');
        //     });

        //     it('Should return token not provided error with status 401', async () => {
        //       const res = await chai
        //         .request(app)
        //         .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
        //       res.should.have.status(401);
        //       res.body.should.have.property('error');
        //       res.body.error.should.equal('Token not Provided');
        //     });

        //     it('Should return jwt error for invalid signature with status 401', async () => {
        //       const res = await chai
        //         .request(app)
        //         .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
        //         .set('authorization', constants.invalidToken)
        //       res.should.have.status(401);
        //       res.body.should.have.property('error');
        //       res.body.error.should.equal('invalid signature')
        //     });

        //     it('Should return no tranactions for this account error with status 404', async () => {
        //       const res = await chai
        //         .request(app)
        //         .get(`/api/v1/accounts/123445678/transactions`)
        //         .set('authorization', userBearerToken)
        //       res.should.have.status(404);
        //       res.body.should.have.property('error');
        //       res.body.error.should.equal('No existing transactions for this account');
        //     });

        //     it('Should return all trasactions and status 200', async () => {
        //       const res = await chai
        //         .request(app)
        //         .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
        //         .set('authorization', userBearerToken)
        //       res.should.have.status(200);
        //       res.body.should.have.property('data');
        //       res.body.data.should.have.length(3);
        //     });

        //     it('Should return an authorization error with status 401', async () => {
        //       const res = await chai
        //         .request(app)
        //         .get(`/api/v1/accounts/${constants.validAcccountNumber}/transactions`)
        //         .set('authorization', cashierBearerToken)
        //       res.should.have.status(401);
        //       res.body.should.have.property('error');
        //       res.body.error.should.equal('you must be a user to perform this task');
        //     });
        //   })

        //   describe('Get a single transaction', () => {
        //     it('Should return transaction does not exist error with status 404', async () => {
        //       const res = await chai
        //         .request(app)
        //         .get(`/api/v1/transactions/10`)
        //         .set('authorization', userBearerToken)
        //       res.should.have.status(404);
        //       res.body.should.have.property('error');
        //       res.body.error.should.equal('The selected transaction does not exist');
        //     });

        //     it('Should return all trasactions and status 200', async () => {
        //       const res = await chai
        //         .request(app)
        //         .get(`/api/v1/transactions/1`)
        //         .set('authorization', userBearerToken)
        //       res.should.have.status(200);
        //       res.body.should.have.property('data');
        //     });
        //     });
    })
});