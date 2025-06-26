const express = require('express');
const app = express();
const path = require('path');// EJSテンプレートンジンを使用するためのモジュール
const {v4: uuid} = require('uuid');// UUIDを生成するためのモジュール
const User = require('./data/user');// ユーザーデータを管理するためのモジュール
const passport = require('passport');// 認証のためのモジュール
const LocalStrategy = require('passport-local');// ローカル認証戦略を使用するためのモジュール
const { isLoggedIN } = require('./middle');

const todo = require('./data/todoData');// todoデータを管理するためのモジュール
const session = require('express-session');// セッション管理のためのモジュール
const flash = require('connect-flash');// フラッシュメッセージを使用するためのモジュール
const sessionOptions = {secret: 'mysecret', resave: false, saveUninitialized: false};// セッションのオプション
const mongoose = require('mongoose');// MongoDBと接続するためのモジュール
mongoose.connect('mongodb://localhost:27017/todo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDBに接続しました'))
  .catch(err => console.error('MongoDB接続エラー:', err));

app.use(express.json());// JSONデータをパースするためのミドルウェア
app.use(express.static(path.join(__dirname, 'data')));// 静的ファイルを提供するためのミドルウェア
app.use(session(sessionOptions));// セッションを使用するためのミドルウェア
app.use(flash());// フラッシュメッセージを使用するためのミドルウェア
app.use(express.static(path.join(__dirname, 'public')));// 静的ファイルを提供するためのミドルウェア
app.use(express.urlencoded({ extended: true }));// URLエンコードされたデータをパースするためのミドルウェア
const methodOverride = require('method-override');// HTTPメソッドをオーバーライドするためのミドルウェア
app.use(methodOverride('_method'));// _methodパラメータを使用してHTTPメソッドをオーバーライド
// テンプレートエンジン設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// ユーザー関連のルーティングを使用


app.use(passport.initialize());// Passportの初期化
app.use(passport.session());// Passportのセッションを使用
passport.use(new LocalStrategy(User.authenticate()));// ローカル認証戦略を使用
passport.serializeUser(User.serializeUser());// ユーザーのシリアライズ
passport.deserializeUser(User.deserializeUser());// ユーザーのデシリアライズ

const router = require('./routes/route');
const userRoutes = require('./routes/users');

app.use('/', userRoutes);
app.use('/', router);

app.delete('/home/:id',isLoggedIN, async (req, res) => {
  const { id } = req.params;
  await todo.deleteOne({ id });
  req.flash('msg', 'タスクを削除しました！またね！');
  res.redirect('/home');
});

app.delete('/home/complete/:id',isLoggedIN, async (req, res) => {
  const { id } = req.params;
  await todo.deleteOne({ id });
  req.flash('msg', 'タスクを完了しました！ナイス！');
  res.redirect('/home');
});

app.get('/home/:id/edit',isLoggedIN, async (req, res) => {
  const { id } = req.params;
  const shows = await todo.findOne({ id });
  req.flash('msg', 'タスクを編集しました');
  res.render('edit', { shows });
});

app.get('/home',isLoggedIN, async (req, res) => {
  try {
    const homeshow = await todo.find({user: req.user._id}).sort({deadline: 1}); // 配列として取得
    const msg = req.query.msg;
    res.render('home', { homeshow, flashMessage: req.flash('msg'),
      username: req.user.username
     });

  } catch (err) {
    res.status(500).send('データ取得エラー');
  }
});

app.post('/add',isLoggedIN, (req, res) => {
  const newTask = req.body.task;
  const newTodo = new todo({ id: uuid(), task: newTask, deadline: req.body.deadline,user: req.user._id });
  newTodo.save()
    .then(() => {
      req.flash('msg', 'タスクを追加しました！がんばれ！');
      res.redirect('/home');
    })
    .catch(err => console.error('Error saving todo:', err));
});



app.listen(3000, () => {
  console.log('ポート3000でリクエスト待機中...');
});
