var express = require('express'),
    pug = require('pug'),
    path = require('path'),
    route = require('./routes/routes.js'),
    session = require('express-session'),
    bodyparser = require('body-parser');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));
app.use(session({secret: "cookie_key", cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}));

var urlencodedParser = bodyparser.urlencoded({
    extended: true
});

app.get('/', route.index);
app.get('/AdminOnly', route.AdminOnly);
app.get('/CreateAccount', route.CreateAccount);
app.get('/edit/:id', route.edit);
app.get('/details/:id', route.details);
app.post('/CreateAccount', urlencodedParser, route.createUser);
app.post('/edit/:id', urlencodedParser, route.editUser);
app.get('/delete/:id', route.delete);

app.listen(3000);
