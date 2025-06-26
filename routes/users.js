const express = require('express');
const router = express.Router();
const todo = require('../data/todoData');
const User = require('../data/user'); // ユーザーデータを管理するためのモジュール
const passport = require('passport'); // 認証のためのモジュール
const { isLoggedIN } = require('../middle');

router.get('/register', (req, res) => {
    res.render('register', { flashMessage: req.flash('msg') });
});
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.flash('msg', 'ユーザー登録が完了しました！');
        res.redirect('/login');
    } catch (err) {
        req.flash('msg', "ユーザー登録に失敗しました。");
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('login', { flashMessage: req.flash('msg')  });
});

router.post('/login', 
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
        req.flash('msg', 'ログイン成功');
        res.redirect('/home');
    }
);

router.post('/logout', (req, res) => {
        req.logout(function(err){
            if (err) {
                req.flash('msg', 'ログアウト中にエラーが発生しました。');
                return res.status(500).send('ログアウト中にエラーが発生しました。');
            }
        req.flash('msg', 'ログアウトしました！');
        res.redirect('/login');
    });
});


module.exports = router;