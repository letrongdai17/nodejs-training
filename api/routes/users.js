const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User
    .find({ email: req.body.email })
    .then(user => {
      if (user.length >= 1) {
        res.status(409).json({
          message: 'Email existed'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result =>{
                res.status(201).json({
                  message: 'User created successfully',
                  result,
                })
              })
              .catch(error => {
                res.status(500).json({
                  error,
                })
              });
          }
        })
      }
    })
    .catch();
});

router.delete('/:userId', (req, res, next) => {
  User
  .remove({ _id: req.params.userId })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'delele user successfully'
    });
  })
  .catch(error => {
      res.status(500).json({
        error,
      })
    }
  );
});

router.post("/signin", (req, res, next) => {
  User
    .find({ email: req.body.email })
    .exec()
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({
          message: 'Email or password is incorrect',
        });
      }
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          res.status(404).json({
            message: 'Email or password is incorrect!',
          });
        }
        if (result) {
          const token = jwt.sign({
              email: users[0].email,
            },
            "secret-key",
            {
              expiresIn: "1h"
            },
          )
          return res.status(200).json({
            message: 'Login successfully',
            token,
          })
        }
      })
    })
    .catch(error => {
      res.status(500).json({
        error,
      })
    });
});

module.exports = router;
