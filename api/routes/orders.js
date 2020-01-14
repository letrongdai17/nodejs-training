const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Order
    .find()
    .select('product quantity _id')
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.post('/', (req, res, next) => {
  Product
    .findById(req.body.productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: 'product not found',
        })
      } else {
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: product._id,
        })
  
        return order.save();
      }
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(error => {
      res.status(500).json({
        error: error,
        message: 'Server error',
      })
    });
});

router.get("/:orderId", (req, res, next) => {
  Order
    .findById(req.params.orderId)
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: 'Server error',
        error: err,
    })
  })
});

router.delete("/:orderId", (req, res, next) => {
  Order
    .remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Delete successfully',
        result,
      });
    })
    .catch(error => {
      res.status(500).json({ error });
    })
})

module.exports = router;
