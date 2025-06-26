const express = require('express');
const router = express.Router();
const todo = require('../data/todoData');
const { isLoggedIN } = require('../middle');

router.get('/show/:id',isLoggedIN, async (req, res) => {
   const { id } = req.params;
   const shows = await todo.findOne({ id });
   res.render('show', { shows });
});

router.patch('/home/:id',isLoggedIN, async (req, res) => {
  const { id } = req.params;
  const editTask = req.body.task;
  const editDeadline = req.body.deadline;
  const task = await todo.findOne({ id });
  if (task) {
    task.task = editTask;
    task.deadline = editDeadline;
    await task.save();
    res.redirect('/home');
  } else {
    res.status(404).send('タスクが見つかりません');
  }
});

module.exports = router;