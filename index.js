var express = require('express'),
	pug = require('pug'),
	path = require('path'),
	route = require('./routes/routes.js'),
	session = require('express-session'),
	bodyparser = require('body-parser'),
	bcrypt = require('bcrypt-nodejs');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));
app.use(
	session({
		secret: 'cookie_key',
		name: 'sessionId',
		cookie: { maxAge: 60000 },
		resave: true,
		saveUninitialized: true
	})
);

app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

var urlencodedParser = bodyparser.urlencoded({
	extended: true
});

app.get('/', route.index);
app.get('/AdminOnly', route.AdminOnly);
app.get('/Login', route.Login);
app.get('/Account', route.Account);
app.get('/CreateAccount', route.CreateAccount);
app.get('/edit/:id', route.edit);
app.get('/AdminEdit/:id', route.AdminEdit);
app.get('/details/:id', route.details);
app.post('/signIn', urlencodedParser, route.signIn);
app.post('/CreateAccount', urlencodedParser, route.createUser);
app.post('/edit/:id', urlencodedParser, route.editUser);
app.post('/AdminEdit/:id', urlencodedParser, route.editUser);
app.get('/delete/:id', route.delete);

app.listen(3000);
