var dbconfig = require('../../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


module.exports.addQuestionnaire = function (req, res) {
    var data = {
        'title' : req.body.title
    };


    connection.query('INSERT INTO questionnaire SET ? ', data, function(err, response) {
        console.log(response.insertId);
        if(err) {
            res.json({
                status: 500,
                message:'there are some error with query'
            })
        } else {
            res.json({
                status: 200,
                message:'Questionnaire has been added'
            })
        }
    });
};
module.exports.updateQuestionnaire = function (req, res) {

};
module.exports.deleteQuestionnaire = function (req, res) {
    var data = req.params.id;

    connection.query('DELETE FROM questionnaire WHERE id = ?', data, function(err, rows) {
        if(err) {
            res.json({
                status: 500,
                message:'there are some error with query'
            })
        } else {
            res.json({
                status: 200,
                message:'Questionnaire has been removed'
            })
        }
    });
};







module.exports.addQuestions = function(req, res) {
    var data = {
        'text' : req.body.text,
        'type' : req.body.type,
        'questionnaire_id' : req.body.questionnaire_id,
        'answer_1' : req.body.answer_1,
        'answer_2' : req.body.answer_2,
        'answer_3' : req.body.answer_3,
        'answer_4' : req.body.answer_4
    };

    connection.query('INSERT INTO questions SET ? ', data, function(err, response) {
        if(err) {
            res.json({
                status: 500,
                message:'there are some error with query'
            })
        } else {
            res.json({
                status: 200,
                message:'Questions has been added'
            })
        }
    });

};
module.exports.editQuestions = function(req, res) {
    var question_id = req.params.id;
    var data = {
        'text' : req.body.edit_q,
        'answer_1' : req.body.answer_1,
        'answer_2' : req.body.answer_2,
        'answer_3' : req.body.answer_3,
        'answer_4' : req.body.answer_4
    };

    connection.query('UPDATE questions set ? WHERE id = ?', [data,question_id], function(err, rows) {
        if(err) {
            res.json({
                status: 500,
                message:'there are some error with query'
            })
        } else {
            res.json({
                status: 200,
                message:'Questions has been updated'
            })
        }
    });
};
module.exports.deleteQuestions = function(req, res) {
    var question_id = req.params.id;

    connection.query('DELETE FROM questions WHERE id = ?', question_id, function(err,rows) {
        if(err) {
            res.json({
                status: 500,
                message:'there are some error with query'
            })
        } else {
            res.json({
                status: 200,
                message:'Questions has been removed'
            })
        }
    });
};