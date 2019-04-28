import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';


const app = express();
const PORT = process.env.PORT || 3000;


const swaggerDoc = yaml.load(`${process.cwd()}/swagger.yaml`);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', router);
app.get('/', (req, res) => {
  res.status(200).send(
    'Welcome to Banka...',
  );
});
app.get('/*', (req, res) => {
  res.status(404).send({
    status: 404,
    error: 'Not found',
  });
});
app.post('/*', (req, res) => {
  res.status(404).send({
    status: 404,
    error: 'Not found',
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
