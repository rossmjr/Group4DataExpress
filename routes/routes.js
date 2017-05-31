var mongoose = require('mongoose'),
	config = require('../config.json'),
	bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');
var hash;
var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function(callback) {});

var userSchema = mongoose.Schema({
	userName: String,
	pass: String,
    type: String,
	email: String,
	age: String,
	answer1: String,
	answer2: String,
	answer3: String
});

var User = mongoose.model('User_Collection', userSchema);

exports.index = function(req, res) {
	User.find(function(err, person) {
		if (err) return console.error(err);
		res.render('index', {
			title: 'User List',
			userList: person,
			config: config
		});
	});
};

exports.AdminOnly = function(req, res) {
	User.find(function(err, person) {
		if (err) return console.error(err);
		res.render('AdminOnly', {
			title: 'User List',
			userList: person,
			config: config
		});
	});
};

exports.Login = function(req, res) {
	User.find(function(err, person) {
		if (err) return console.error(err);
		res.render('Login', {
			title: 'Sign in',
			userList: person,
			config: config
		});
	});
};

exports.Account = function(req, res) {
	User.find(function(err, person) {
		if (err) return console.error(err);
		res.render('Account', {
			title: 'Account Info',
			userList: person,
			config: config
		});
	});
};

exports.CreateAccount = function(req, res) {
	res.render('CreateAccount', {
		title: 'Add User',
		config: config
	});
};

exports.createUser = function(req, res) {
	bcrypt.hash(req.body.pass, null, null, function(err, hash) {});
	var person = new User({
		userName: req.body.userName,
		pass: hash,
        type: req.body.type,
		email: req.body.email,
		age: req.body.age,
		answer1: req.body.answer1,
		answer2: req.body.answer2,
		answer3: req.body.answer3
	});
	person.save(function(err, person) {
		if (err) return console.error(err);
		console.log(req.body.userName + ' added');
		console.log(person.pass);
	});
	res.redirect('/');
};

exports.edit = function(req, res) {
	User.findById(req.params.id, function(err, person) {
		if (err) return console.error(err);
		res.render('edit', {
			title: 'Edit User',
			person: person,
			config: config
		});
	});
};

exports.editUser = function(req, res) {
	User.findById(req.params.id, function(err, person) {
		if (err) return console.error(err);
		person.userName = req.body.userName;
		person.pass = req.body.pass;
        person.type = req.body.type;
		person.email = req.body.email;
		person.age = req.body.age;
		person.answer1 = req.body.answer1;
		person.answer2 = req.body.answer2;
		person.answer3 = req.body.answer3;
		person.save(function(err, person) {
			if (err) return console.error(err);
			console.log(req.body.userName + ' updated');
		});
	});
	res.redirect('/');
};

exports.details = function(req, res) {
	User.findById(req.params.id, function(err, person) {
		if (err) return console.error(err);
		res.render('details', {
			title: person.userName + "'s Details",
			person: person,
			config: config
		});
	});
};

exports.delete = function(req, res) {
	User.findByIdAndRemove(req.params.id, function(err, person) {
		if (err) return console.error(err);
		res.redirect('/');
	});
};
