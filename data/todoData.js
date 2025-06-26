
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    task: { type: String, required: true },
    deadline: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // 追加
});

const todo = mongoose.model('todo', todoSchema);
module.exports = todo;
