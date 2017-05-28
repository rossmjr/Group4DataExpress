var express = require('express'),
	pug = require('pug'),
	path = require('path'),
	config = require('./config.json');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

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

app.listen(3000);
