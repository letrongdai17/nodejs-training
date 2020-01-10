const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'GET order successfully'
  });
});

router.post('/', (req, res, next) => {
  const order = {
    name: req.body.name,
  }

  res.status(201).json({
    message: 'POST orders successfully',
    orderCreated: order,
  });
});

module.exports = router;
