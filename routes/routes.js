var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

var secure = require('../helpers/secure');

connection.query('USE ' + dbconfig.database);

module.exports = function(app) {

  // Get homepage
  app.get('/', isLogIn, function(req, res) {
    res.render('index', {title: 'MOP Questionnaire', logged: req.isLogged});
  });

  // Get Login page
  app.get('/signin',isLogIn, function(req, res) {
    res.render('signin', {logged: req.isLogged});
  });

  // Get Register page
  app.get('/signup',isLogIn, function(req, res) {
		res.render('signup', {logged: req.isLogged});
  });

  app.get('/logout', function(req, res) {
      res.clearCookie('x-auth');
      res.clearCookie('user-id');
      res.redirect('/');
  });

  // Get Dashboard
  app.get('/dashboard', secure,isAdmin,isLogIn, function(req, res) {
      connection.query('SELECT * FROM questionnaire', function(err, result) {
          if(err) {
              res.json({
                  status: 500,
                  message:'there are some error with query'
              })
          } else {
              var data = JSON.stringify(result);
              res.render('dashboard', {items: data, logged: req.isLogged});
          }
      });
  });

  app.get('/addQuestionnaire', secure,isAdmin,isLogIn, function(req, res) {
      connection.query('SELECT * FROM questionnaire', function(err, result) {
          if(err) {
              res.json({
                  status: 500,
                  message:'there are some error with query'
              })
          } else {
              var data = JSON.stringify(result);
              res.render('addQuestionnaire', {items: data, logged: req.isLogged});
          }
      });
  });

  app.get('/questionnaire/:id', secure,isLogIn, function(req, res) {

        if(req.params.id) {
            connection.query('SELECT * FROM questions WHERE questionnaire_id = ?', req.params.id, function(err, result) {
                if(result && result.length) {
                    var filteredResults = [];

                    for(var i = 0; i < result.length; i++) {
                        if(result[i].answer_1 === null) {
                            delete result[i].answer_1;
                        }

                        if(result[i].answer_2 === null) {
                            delete result[i].answer_2;
                        }

                        if(result[i].answer_3 === null) {
                            delete result[i].answer_3;
                        }

                        if(result[i].answer_4 === null) {
                            delete result[i].answer_4;
                        }


                        filteredResults.push(result[i]);
                    }

                    res.render('questions', {questions: filteredResults, logged: req.isLogged, questionnaireData: { questionnaire_id: req.params.id, userID: req.cookies['user-id'] } });
                } else {
                    res.render('404');
                }

                if(err) {
                    res.render('error', {errors: err});
                }
            });
        }

    });

  app.get('/edit/:id', secure,isAdmin,isLogIn, function(req, res) {

      if(req.params.id) {
          connection.query('SELECT * FROM questions WHERE questionnaire_id = ?', req.params.id, function(err, result) {
              if(result && result.length) {
                  res.render('edit', {questions: result,logged: req.isLogged});
              } else {
                  res.render('404');
              }

              if(err) {
                  res.render('error', {errors: err});
              }
          });
      }
  });

  app.get('/editSingle/:id', secure,isAdmin,isLogIn, function(req,res) {

      if(req.params.id) {
          connection.query('SELECT * FROM questions WHERE id = ?', req.params.id, function(err, result) {

              if(result && result.length) {

                  var filteredResult = [];

                  for(var i = 0; i < result.length; i++) {
                      if(result[i].answer_1 === null) {
                          delete result[i].answer_1;
                      }

                      if(result[i].answer_2 === null) {
                          delete result[i].answer_2;
                      }

                      if(result[i].answer_3 === null) {
                          delete result[i].answer_3;
                      }

                      if(result[i].answer_4 === null) {
                          delete result[i].answer_4;
                      }


                      filteredResult.push(result[i]);
                  }

                  res.render('editSingle', {question: filteredResult, logged: req.isLogged});
              } else {
                  res.render('404');
              }

              if(err) {
                  res.render('error', {errors: err});
              }

          });
      }
  });

  // Get questionnaire
  app.get('/welcome', secure,isLogIn,  function(req, res) {
    connection.query('SELECT * FROM questionnaire', function(err, result) {
        if(result) {
            res.render('welcome', {items: JSON.stringify(result), logged: req.isLogged});
        }

        if(err) {
            res.json({
                status: 500,
                message: err
            })
        }
    });
  });

};


function isAdmin(req, res, next) {
    if(req.decoded.type === 'admin') {
        next();
    } else {
        res.render('unauthorized');
    }
}


function isLogIn(req, res, next) {
    req.isLogged = req.cookies['x-auth'];

    next();
}