const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product')

const convertResponse = (data) => {
  const response = data.map((item) => ({
    _id: item._id,
    name: item.name,
    price: item.price,
    request: {
      type: 'GET',
      url: `http://localhost:3000/products/${item._id}`,
    }
  }));
  return {
    count: data.length,
    data: response,
  };
}

router.get('/', (req, res, next) => {
  Product
    .find()
    .select('name price _id')
    .exec()
    .then(doc => {
      const response = convertResponse(doc);
      res.status(200).json(response)
    })
    .catch();
});

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product.save().then(result => {
    console.log('result: ', result);
    res.status(201).json(product);
  })
  .catch(err => {
    console.log('error: ', err);
    res.status(500).json({ error: err });
  });
});

router.get('/:productID', (req, res, next) => {
  const id = req.params.productID;
  Product.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'No valid entry for found provided ID',
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Server error',
    });
    });
});

router.delete('/:producId', (req, res, next) => {
  const id = req.params.producId;
  Product
    .remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log('error: ', err);
      res.status(500).json({
        error: err,
      })
    });
})

module.exports = router;
