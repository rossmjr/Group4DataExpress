var mongoose = require('mongoose'),
	session = require('express-session'),
	config = require('../config.json'),
	bcrypt = require('bcrypt-nodejs');

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
            // console.log(accountType);
            if(accountType === 'Admin'){
				if (err) return console.error(err);
					res.render('AdminOnly', {
						title: 'User List',
						userList: person,
						config: config
				});
        	} else {
            	console.log('Access Denied');
           	 res.redirect('/');
       		 }
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

	User.findById(accountId, function(err, person){
		if (err) return console.error(err);
		res.render('Account', {
			title: accountName + "'s Account Info",
			person: person,
			config: config
		});
	})
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
	User.findById(accountId, function(err, person) {
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

var accountType,
	accountId,
	accountName;

exports.signIn = function(req, res) {
    User.findOne({userName: req.body.userName}, function (err, person) {
        //console.log(person.userName);
        var isMatch = bcrypt.compareSync(req.body.pass, person.pass);
        //console.log(isMatch);
        if (isMatch) {
            req.session.regenerate(function (err, user) {
                if(err) return console.error(err);
            	req.session.user = person;
                req.session['userName'] = req.body.userName;
                req.session['type'] = person.type;
                req.session['id'] = person.id;
                req.session['age'] = person.age;
                req.session['email'] = person.email;
                req.session['ans1'] = person.answer1;
                req.session['ans2'] = person.answer2;
                req.session['ans3'] = person.answer3;

				accountId = person._id;
                accountType = person.type;
                accountName = person.userName;
                console.log(accountId);
                console.log(accountName);
                console.log(accountType);
                console.log(req.session.user);
                console.log(req.session.user.type);

                // console.log(req.session['userName']);
                // console.log(req.session['type']);
                // console.log(req.session['_id']);
                // console.log(req.params.id);
                // console.log(req.body.id);
                // console.log(req.session['age']);
                // console.log(req.session['email']);
                // console.log(req.session['ans1']);
                // console.log(req.session['ans2']);
                // console.log(req.session['ans3']);
            });
            res.redirect('/');
        } else {
            console.log('Authentication failed, please check your ' + ' username and password.');
            res.redirect('/Login');
        }
    });
};

exports.Logout = function(req, res) {
    User.findOne({userName: req.body.userName}, function () {
        req.session.destroy();
		res.redirect('/');
        console.log('Session Ended')
    });
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
	User.findById(req.params.id, function(err, user) {
		if (err) return console.error(err);
		res.render('details', {
			title: user.userName + "'s Details",
			person: user,
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
