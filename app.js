const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productsRoutes = require('./api/routes/products');
const ordersRouters = require('./api/routes/orders');

mongoose.connect(`mongodb+srv://nodeShopUser:Ledai12345678@cluster0-x7tct.mongodb.net/test?retryWrites=true&w=majority`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/products', productsRoutes);
app.use('/orders', ordersRouters);


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Origin',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
});

app.use((req, res, next) => {
  const error = new Error('Not found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    }
  });
});

module.exports = app;