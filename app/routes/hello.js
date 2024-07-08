const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// Check if the username contains only letters
router.use('/hello/:username', (req, res, next) => {
  const username = req.params.username;
  if (!/^[A-Za-z]+$/.test(username)) {
    return res.status(400).json({ error: 'Username must contain only letters.' });
  }
  next();
});

// PUT username birthday
router.put('/hello/:username', async (req, res) => {
  const username = req.params.username;
  const { dateOfBirth } = req.body;

  if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid() || moment(dateOfBirth).isAfter(moment())) {
    return res.status(400).json({ error: 'Date of birth must be a valid date before today.' });
  }

  try {
    await User.upsert({ username, dateOfBirth });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET username birthday
router.get('/hello/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare dates at the beginning of a day
    const today = moment();
    today.set({hour:0,minute:0,second:0,millisecond:0})
    let birthDate = moment(user.dateOfBirth).year(today.year());
    birthDate.set({hour:0,minute:0,second:0,millisecond:0})
    // Moment handles the leap year logic
    let diffDays = birthDate.diff(today, 'days');

    if (diffDays === 0) {
      // The BD is today!
      res.json({ message: `Hello, ${username}! Happy birthday!` });
    } else if (diffDays > 0) {
      // The BD is later this year
      res.json({ message: `Hello, ${username}! Your birthday is in ${diffDays} day(s)` });
    } else {
      // The BD was earlier, we need to count days until the next BD
      birthDate = moment(user.dateOfBirth).year(today.year() + 1);
      diffDays = birthDate.diff(today, 'days');
      res.json({ message: `Hello, ${username}! Your birthday is in ${diffDays} day(s)` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;