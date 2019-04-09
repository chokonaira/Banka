import shortid from 'shortid';

export default [
  {
    id: 1,
    owner: shortid.generate(),
    firstname: 'john',
    lastname: 'doe',
    email: 'johndoe@gmail.com',
    type: 'savings',
    accountNumber: 1234567890,
    createdOn: '17/03/2019',
    status: 'active',
    openingBalance: 20000,

  },

  {
    id: 2,
    owner: shortid.generate(),
    firstname: 'doe',
    lastname: 'john',
    email: 'doejohn@gmail.com',
    type: 'savings',
    accountNumber: 987654321,
    createdOn: '17/03/2019',
    status: 'active',
    openingBalance: 20000,
  },
];
