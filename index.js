var express = require('express'),
	pug = require('pug'),
	path = require('path'),
	config = require('./config.json'),
    bodyParser = require('body-parser'),
    route = require('./routes/routes.js');

var app = express();


app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.get('/', function(req, res) {
	var obj = {
		title: '*Home*'
	};
	res.render('index', {
		obj: obj,
		config: config
	});
});

app.get('/:viewname', function(req, res) {
	var obj = {
		title: '*' + req.params.viewname + '*'
	};
	res.render(req.params.viewname, {
		obj: obj,
		config: config
	});
});

app.get('/AdminOnly/', route.index);
app.get('/CreateAccount', route.create);
app.get('/Edit/:id', route.edit);
app.get('/AdminDelete/:id', route.delete);
app.post('/CreateAccount', urlencodedParser, route.createUser);
app.post('/Edit/:id', urlencodedParser, route.editUser)
app.get('/Account', route.details);




app.listen(3000);
