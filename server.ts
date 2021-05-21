import express from 'express';

const app = express();
//app.use("/orders", orderRouter);

app.get('/api/v1', (req, res) => {
  res.send('<H1>Hi from express</H1>');
});
const post = require('./routes/posts');
app.use('/api/v1/posts', post);

app.listen(4500, () => {
  console.log('Node server started running');
});
