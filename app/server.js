import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import swaggerui from 'swagger-ui-express';
import swaggerDoc from '../swagger.json';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/v1', router);
router.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDoc));
app.get('/', (req, res) => {
  res.status(200).send(
    'Welcome to Banka...',
  );
});
app.get('/*', (req, res) => {
  res.status(404).send({
    status: 404,
    error: 'bad request, invalid route',
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
