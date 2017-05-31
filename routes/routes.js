var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var userSchema = mongoose.Schema({
    userName: String,
    pass: String,
    email: String,
    age: String,
    answer1: String,
    answer2: String,
    answer3: String
});

var User = mongoose.model('User_Collection', userSchema);

exports.index = function (req, res) {
    User.find(function (err, user) {
        if(err) return console.lerror(err);
        res.render('index', {
            title: 'User List',
            user: user
        });
    });
};

exports.create = function (req, res) {
    res.render('create', {
        title: 'Add User'
    });
};

exports.createUser = function (req, res) {
    var user = new User ({
        userName: req.body.userName,
        pass: req.body.pass,
        email: req.body.email,
        age: req.body.age,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3
    });
    
    user.save(function (err, user) {
        if (err) return console.error(err);
    console.log(req.body.userName + ' added');
  });
  res.redirect('/AdminOnly');
};

exports.editUser = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return console.error(err);
        user.userName = req.body.userName;
        user.pass = req.body.pass;
        user.email = req.body.email;
        user.age = req.body.age;
        user.answer1 = req.body.answer1;
        user.answer2 = req.body.answer2;
        user.answer3 = req.body.answer3
        user.save(function (err, user) {
            if (err) return console.error(err);
            console.log(req.body.name + ' updated');
        });
    });
    res.redirect('/');
}

exports.details = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if(err) return console.error(err);
        res.render('details', {
            title: user.userName + "'s Details",
            user: user
        });
    });
};

exports.edit = function(req, res) {
    User.findById(req.params.id, function (err, user) {
        if(err) return console.error(err);
        res.render('edit', {
            title: 'Edit User',
            user: user
        });
    });
};

exports.delete = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return console.error(err);
    //res.redirect('/');
  });
};