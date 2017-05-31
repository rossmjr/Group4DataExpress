
var mongoose = require('mongoose'),
    config = require('../config.json');
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
    User.find(function (err, person) {
        if (err) return console.error(err);
        res.render('index', {
            title: 'User List',
            userList: person,
            config: config
        })
    })
};

exports.AdminOnly = function (req, res) {
    User.find(function (err, person) {
        if (err) return console.error(err);
        res.render('AdminOnly', {
            title: 'User List',
            userList: person,
            config: config
        })
    })
};

exports.CreateAccount = function (req, res) {
    res.render('CreateAccount', {
        title: 'Add User',
        config: config
    });
};

exports.createUser = function (req, res) {
    var person = new User({
        userName: req.body.userName,
        pass: req.body.pass,
        email: req.body.email,
        age: req.body.age,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3
    });
    person.save(function (err, person) {
        if (err) return console.error(err);
        console.log(req.body.userName + ' added');
    });
    res.redirect('/');
};

exports.edit = function (req, res) {
    User.findById(req.params.id, function (err, person) {
        if (err) return console.error(err);
        res.render('edit', {
            title: 'Edit User',
            person: person,
            config: config
        });
    });
};

exports.editUser = function (req, res) {
    User.findById(req.params.id, function (err, person) {
        if (err) return console.error(err);
        person.userName = req.body.userName;
        person.pass = req.body.pass;
        person.email = req.body.email;
        person.age = req.body.age;
        person.answer1 = req.body.answer1;
        person.answer2 = req.body.answer2;
        person.answer3 = req.body.answer3;
        person.save(function (err, person) {
            if (err) return console.error(err);
            console.log(req.body.userName + ' updated');
        });
    });
    res.redirect('/');
};

exports.details = function (req, res) {
    User.findById(req.params.id, function (err, person) {
        if (err) return console.error(err);
        res.render('details', {
            title: person.userName + "'s Details",
            person: person,
            config: config
        });
    });
};

exports.delete = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, person) {
        if (err) return console.error(err);
        res.redirect('/');
    });
};