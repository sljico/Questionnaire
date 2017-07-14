var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var flash = require('connect-flash');
var jwt = require('jsonwebtoken');

var secure = require('./helpers/secure');

var apiRoute = require('./routes/api/api');
var apiAdmin = require('./routes/api/administrator');


var app = express();


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.post('/api/signup', apiRoute.register);
app.post('/api/signin', apiRoute.authenticate);
app.post('/api/addQuestionnaire', apiAdmin.addQuestionnaire);
app.post('/api/updateQuestionnaire/:id', apiAdmin.updateQuestionnaire);
app.delete('/api/deleteQuestionnaire/:id', apiAdmin.deleteQuestionnaire);
app.post('/api/addQuestions', apiAdmin.addQuestions);
app.put('/api/editQuestions/:id', apiAdmin.editQuestions);
app.delete('/api/deleteQuestions/:id', apiAdmin.deleteQuestions);
app.post('/api/submitData', apiRoute.submitData);
require('./routes/routes.js')(app);






app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404');
});


app.listen(3000, function() {
    console.log('app is listening at port : 3000');
});
