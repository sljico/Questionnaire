var dbconfig = require('../../config/database');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');

var secret = 'ilovescotchyscotch';
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports.register = function(req, res) {
    var users = {
        'first_name' : req.body.first_name,
        'last_name' : req.body.last_name,
        'email' : req.body.email,
        'type': req.body.email === 'admin@admin.com' ? 'admin' : 'user'
    };


    connection.query('SELECT * FROM users WHERE users.email = ?', [users.email], function(err, rows) {
        if(err) {
            res.json({
                status: 500,
                message:'there are some error with query'
            })
        }
        if(rows.length) {
            res.json({
                status: 409,
                message: 'That email is already taken'
            })
        } else {
            // create a token
            var token = jwt.sign(users, secret);

            if(token) {
                users.token = token;
                connection.query('INSERT INTO users SET ?', users, function(err, results) {
                    if(err) {
                        res.json({
                            status: 500,
                            message:'there are some error with query'
                        })
                    } else {
                        res.json({
                            status: 200,
                            message:'user registered sucessfully',
                            data: {token: token, type: users.type, userID: results.insertId}
                        })
                    }
                });
            }
        }
    });
};

module.exports.authenticate = function (req, res) {
    var  email = req.body.email;

    connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows) {
        if(err) {
            res.json({
                status:500,
                message:'there are some miner error with query'
            })
        }
        if(rows.length > 0) {
            res.json({
                status:200,
                message:'your form successfully good luck',
                data: {token: rows[0].token, type: rows[0].type, userID: rows[0].id}
            })
        } else {
            res.json({
                status:404,
                message:"your Email does not match"
            });
        }
    });
};


module.exports.submitData = function (req, res) {
    var userId = parseInt(req.body[1].value);
    var questionnaireId = parseInt(req.body[0].value);
    var data = [];
    var answerValue = [];


    for(var i = 2; i < req.body.length; i++) {
        var submitQuestionId = req.body[i].questionID;

        var submitData = {
            userID: userId,
            questionnaireID: parseInt(req.body[0].value),
            questionID: submitQuestionId,
            answer: req.body[i].value
        };

        var result = Object.keys(submitData).map(function(e) {
            return [submitData[e]];
        });

        data.push(result);
    }

    for(var j = 0; j < data.length; j++) {
        answerValue.push(data[j]);
    }

    var sql = 'INSERT INTO results (userID, questionnaireID, questionID, answer) VALUES ?';


    connection.query('SELECT * FROM results WHERE userID = ? AND questionnaireID =?', [userId,questionnaireId ], function(err, rows) {
        if(err) {
            res.json({
                status: 500,
                message:'there are some error with query'
            })
        }
        if(rows.length) {
            res.json({
                status: 409,
                message:'You already submitted this questionnaire'
            })
        } else {
            connection.query(sql,[answerValue], function(err, rows) {
                if(err) {
                    res.json({
                        status: 500,
                        message:'there are some error with query'
                    })
                } else {
                    res.json({
                        status: 200,
                        message:'Questionnaire submitted sucessfully'
                    })
                }
            });
        }
    });

};
