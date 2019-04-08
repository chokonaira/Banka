import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).send(
    'Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money..',
  );
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
