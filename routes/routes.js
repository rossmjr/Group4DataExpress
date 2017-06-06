var mongoose = require('mongoose'),
	express = require('express'),
	session = require('express-session'),
	config = require('../config.json'),
	bcrypt = require('bcrypt-nodejs');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

var SALT_WORK_FACTOR = 10;
var mdb = mongoose.connection;

mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function(callback) {});

var userSchema = mongoose.Schema({
	userName: {type: String, required: true, index: {unique: true} },
	pass: {type: String, required: true},
  	type: String,
	email: {type: String, required: true},
	age: {type: String, required: true},
	answer1: {type: String, required: true},
	answer2: {type: String, required: true},
	answer3: {type: String, required: true}
});

var User = mongoose.model('User_Collection', userSchema);

function authenticate(name, hash, fn) {
    var query = User.findOne({'pass': hash});

        User.findOne({
                userName: name
            },
            function(err, person) {
                if(person){
                    if(err) return fn(new Error('cannot find user'));
                    bcrypt.compare(hash, query, function(err, hash) {
                        if(err) return fn(err);
                        if(hash === person.pass) return fn(null, person);
                        fn(new Error('invalid password'));
                    });
                } else {
                    return fn(new Error('cannot find user'));
                }
            })

}

function requiredAuthentication(req, res, next) {
    if (req.session.person) {
        next();
    } else {
        console.log('Access denied!');
        res.redirect('/Login');
    }
}

function userExist(req, res, next) {
    User.count({
        userName: req.body.userName
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            console.log("User Exist");
            res.redirect("/CreateAccount");
        }
    });
}

exports.index = function(req, res) {
	User.find(function(err, person) {
		if (err) return console.error(err);
		res.render('index', {
			title: 'Results',
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
	User.findById(req.params.id, function(err, person) {
		if (err) return console.error(err);
		res.render('Account', {
			title: person.userName + "s Account Info",
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
	var person = new User({
		userName: req.body.userName,
		pass: bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync(SALT_WORK_FACTOR)),
    	type: req.body.type,
		email: req.body.email,
		age: req.body.age,
		answer1: req.body.answer1,
		answer2: req.body.answer2,
		answer3: req.body.answer3
	});
    userExist(req.body.userName, person.save(function(err, person) {
        if (err) return console.error(err);
        console.log(req.body.userName + ' added');
        console.log(person.pass);
    }));

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

exports.AdminEdit = function(req, res) {
   User.findById(req.params.id, function(err, person) {
		if (err) return console.error(err);
		res.render('AdminEdit', {
			title: 'Edit User',
			person: person,
			config: config
		});
	}); 
};

exports.signIn = function(req, res) {
	// User.findOne({userName: req.body.userName}, function(err, person) {
	// 	console.log(person.userName);
	// 	var isMatch = bcrypt.compareSync(req.body.pass, person.pass);
	// 	console.log(isMatch);
	// });
	// res.redirect('/');
    authenticate(req.body.userName, req.body.pass, function (err, person) {
        if (person) {
            req.session.regenerate(function () {
                req.session.person = person;

                res.redirect('/');
            });
        } else {
            console.log('Authentication failed, please check your ' + ' username and password.');
            res.redirect('/Login');
        }
    });
};

exports.Logout = function(req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    })
};


exports.editUser = function(req, res) {
	User.findById(req.params.id, function(err, person) {
		if (err) return console.error(err);
		person.userName = req.body.userName;
		person.pass = bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync(SALT_WORK_FACTOR));
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
		res.redirect('/AdminOnly');
	});
};
