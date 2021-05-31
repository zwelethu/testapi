import express, { NextFunction } from 'express';

const app = express();
app.use(express.json());

app.get('/api/v1', (req, res) => {
  res.send('<H1>Hi from express</H1>');
});

const bitcoin = require('./routes/bitcoint');

app.use('/api/v1/prices', bitcoin);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);
app.listen(4500, () => {
  console.log('Node server started running');
});
