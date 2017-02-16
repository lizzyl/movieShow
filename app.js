var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
// var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var promise = require('promise')
var morgan = require('morgan');
var multiparty = require('connect-multiparty')
var port = process.env.PORT || 3400
var app = express()
app.locals.moment = require('moment')

var fs = require('fs')
var dbUrl = 'mongodb://localhost/imooc'
mongoose.connect(dbUrl)

//models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file

      var stat = fs.statSync(newPath)

      if(stat.isFile()) {
        if(/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        } else {
          walk(newPath)
        }
      }
    })
}
walk(models_path)

app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser())
app.use(cookieParser());
app.use(multiparty());
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

var env = process.env.NODE_ENV || 'development'
if('development' === env) {
	app.set('showStackError', true);
	app.use(morgan(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

require('./config/router')(app)

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port)

console.log('listen on port' + port)

