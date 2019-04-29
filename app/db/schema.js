
import helpers from '../helpers/helpers';

const hashedPassword = helpers.hashPassword('password');
// Database Queries defining the structure of the Database

const tables = {
  usersTable: `CREATE TABLE IF NOT EXISTS
    users(
      user_id serial PRIMARY KEY,
      firstname varchar,
      lastname varchar,
      email varchar UNIQUE,
      password varchar(400),
      type varchar,
      isAdmin boolean DEFAULT false,
      createdOn TIMESTAMP DEFAULT NOW()
    )`,
  accountsTable: `CREATE TABLE IF NOT EXISTS
    accounts (
      account_id serial NOT  NULL,
      accountNo INTEGER PRIMARY KEY,
      createdOn TIMESTAMP DEFAULT NOW(),
      owner INTEGER,
      type varchar(50),
      status varchar(50),
      openingBalance DECIMAL NOT NULL DEFAULT 0,
      accountBalance DECIMAL DEFAULT 0      
    )`,
  transactionsTable: `CREATE TABLE IF NOT EXISTS
  transactions (
      transaction_id serial PRIMARY KEY,
      createdOn TIMESTAMP DEFAULT NOW(),
      type varchar(50),
      accountNo INTEGER REFERENCES accounts (accountNo) ON DELETE CASCADE,
      cashier INTEGER NOT NULL,
      amount DECIMAL NOT NULL,
      accountBalance DECIMAL NOT NULL 
    )`,

  droptables: `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS accounts CASCADE;
    DROP TABLE IF EXISTS transactions CASCADE
  `,
  seed: `
  INSERT INTO
  users(firstname, lastname, email, type, password, isAdmin)
  VALUES('Bank', 'Admin', 'admin@gmail.com', 'staff', '${hashedPassword}', 'true');
  INSERT INTO
  users(firstname, lastname, email, type, password, isAdmin)
  VALUES('Bank', 'Cashier', 'cashier@gmail.com', 'staff', '${hashedPassword}', 'false');
  `,
  testseeds: `
    INSERT INTO
    users(firstname, lastname, email, type, password, isAdmin)
    VALUES('Test', 'Admin', 'testadmin@gmail.com', 'staff', '${hashedPassword}', 'true') 
    RETURNING user_id, firstname, lastname, email, type, isAdmin;
    INSERT INTO
    users(firstname, lastname, email, type, password, isAdmin)
    VALUES('Test', 'Cashier', 'testcashier@gmail.com', 'staff', '${hashedPassword}', 'false') 
    RETURNING user_id, firstname, lastname, email, type, isAdmin;
    INSERT INTO
    users(firstname, lastname, email, type, password, isAdmin)
    VALUES('Test', 'User', 'testuser@gmail.com', 'user', '${hashedPassword}', 'false') 
    RETURNING user_id, firstname, lastname, email, type, isAdmin;
    INSERT INTO 
    accounts(accountNo, owner, type, status, openingBalance)
    VALUES (123456709, 3, 'saving', 'active', 5000);
    INSERT INTO 
    accounts(accountNo, owner, type, status, openingBalance)
    VALUES (123956709, 3, 'saving', 'active', 5000);
    INSERT INTO 
    accounts(accountNo, owner, type, status, openingBalance)
    VALUES (123456749, 3, 'saving', 'dormant', 5000);
    INSERT INTO 
    accounts(accountNo, owner, type, status, openingBalance)
    VALUES (123456729, 3, 'saving', 'dormant', 5000);
    INSERT INTO 
    transactions(type, accountNo, amount, cashier, accountBalance)  
    VALUES ('credit', 123456709, 5000, 2, 10000);
    INSERT INTO 
    transactions(type, accountNo, amount, cashier, accountBalance)  
    VALUES ('debit', 123456709, 2000, 2, 8000);
    INSERT INTO 
    transactions(type, accountNo, amount, cashier, accountBalance)  
    VALUES ('credit', 123456709, 5000, 2, 5000);
`,
};

export default tables;
