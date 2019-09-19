[![Build Status](https://travis-ci.org/chokonaira/Banka.svg?branch=develop)](https://travis-ci.org/chokonaira/Banka)  [![Coverage Status](https://coveralls.io/repos/github/chokonaira/Banka/badge.svg)](https://coveralls.io/github/chokonaira/Banka)  [![Maintainability](https://api.codeclimate.com/v1/badges/620dd07ffb14ae57ec13/maintainability)](https://codeclimate.com/github/chokonaira/Banka/maintainability) 


# Banka
Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money..


### UI Templates
My UI templates can be found here: [ UI ](https://banka--react.herokuapp.com)

### Pivotal Tracker
My Pivotal Tracker board can be found [ here ](https://www.pivotaltracker.com/n/projects/2320730)

### API Endpoints
My API can be found here: [ API ](https://banka101.herokuapp.com)

### API Documentation
My Swagger API documentation can be found [ here ](https://banka101.herokuapp.com/api-docs)

### Key Application Features
An admin can perform the following:
1. User (client) can sign up.
2. User (client) can login.
3. User (client) can create an account.
5. User can view account details
5. User (client) can view account transaction history.
6. User (client) can view a specific account transaction.
7. Staff (cashier) can debit user (client) account.
8. Staff (cashier) can credit user (client) account.
9. Admin/staff can view all user accounts.
10. Admin/staff can view a specific user account.
11. Admin/staff can activate or deactivate an account.
12. Admin/staff can delete a specific user account.


### API Information

METHOD |    DESCRIPTION       |   ENDPOINTS
-------|----------------------|-------------------------
POST | User (client) can sign up | api/v1/auth/signup
POST | User (client) can login | auth/login
POST | User (client) can create an account | /api/v1/accounts
GET | User can view account details | api/v1/accounts/:accountNumber
GET | User (client) can view account transaction history | api/v1/accounts/:accountNumber/transactions
GET | User (client) can view a specific account transaction | /api/v1/transactions/:transactionId
PATCH | Staff (cashier) can debit user (client) account | /api/v1/transactions/:accountNumber/debit
PATCH | Staff (cashier) can credit user (client) account | /api/v1/transactions/:accountNumber/credit
GET | Admin/staff can view all user accounts | /api/v1/accounts
GET | Admin/staff can view a specific user account | /api/v1/user/:emailAddress/accounts
PATCH | Admin/staff can activate or deactivate an account | /api/v1/accounts/:accountNumber
DELETE| Admin/staff can delete a specific user account | /api/v1/accounts/:accountNumber

### Compiler

* [Babel](https://eslint.org/) - Compiler for Next Generation JavaScript

### Installation

- Clone the repository.
``` git clonehttps://github.com/chokonaira/Banka.git ```

more info:
(https://help.github.com/articles/cloning-a-repository/)
- Run ``` npm install ``` to install the dependencies in the package.json file.
- Rename ``` .env.sample ``` to ```.env``` and update file as specified.
- Run ``` npm start ``` to start the application.

## Running tests

Tests were written using [Mocha](https://mochajs.org) and [Chai](https://chaijs.com) dev-dependencies

### end to end tests

Mocha provides the tools for cleaning the state of the software while Chai is an assertion library that is used alongside Mocha in order to ensure that test cases meet expectations. For example

```
describe('GET /accounts', () => {
  it('should fetch all user accounts', (done) => {
     api.get('/api/v1/accounts')
     .set('Accept', 'application/json')
     .expect(200)
     .end(done);
    });
  });
```

### And coding style tests too

This project was built with the linter eslint and an [airbnb style guide](https://github.com/airbnb/javascript)

```
"rules": {
      "one-var": 0,
      "one-var-declaration-per-line": 0,
      "new-cap": 0,
      "consistent-return": 0,
      }
```

## Built With

* [HTML5 & CSS3 + Vanilla JavaScript](http://developer.mozilla.org/en-US/docs/) - Web development
* [NodeJs](https://nodejs.org/) - JavaScript runtime environment
* [ExpressJs](https://expressjs.com) - Node RESTful API framework
* [PostgreSQL](https://www.postgresql.org/) - Used as database for the app

## Version Control

I use [Github](http://github.com/) for version control.

## Authors

* **Henry Okonkwo**


This project is a Henry and Andela bootcamp cycle-43 project 2019
