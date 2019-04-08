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
    openingBalance: '20,000000',

  },
];
