module.exports.isLoggedIN = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('msg', 'ログインしてください！');
        return res.redirect('/login');
    }
    next();
}