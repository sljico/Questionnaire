var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `first_name` VARCHAR(20) NOT NULL, \
    `last_name` VARCHAR(20) NOT NULL, \
    `email` VARCHAR(50) NOT NULL, \
    `type` varchar(20) NOT NULL, \
    `token` varchar(10000) NULL, \
    PRIMARY KEY (`id`) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.questionnaire_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `title` VARCHAR(100) NOT NULL, \
    PRIMARY KEY (`id`) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.questions_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `text` VARCHAR(200) NOT NULL, \
    `type` VARCHAR(200) NOT NULL, \
    `answer_1` VARCHAR(200) NULL, \
    `answer_2` VARCHAR(200) NULL, \
    `answer_3` VARCHAR(200) NULL, \
    `answer_4` VARCHAR(200) NULL, \
    `questionnaire_id` INT(200) NOT NULL, \
    PRIMARY KEY (`id`) \
)');

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.results_table + '` ( \
    `id` int(5) NOT NULL AUTO_INCREMENT, \
     `userID` int(100) NOT NULL, \
    `questionnaireID` int(100) NOT NULL, \
    `questionID` int(100) NOT NULL, \
    `answer` varchar(500) NOT NULL, \
    PRIMARY KEY (`id`) \
)');


console.log('Success: Database Created!');

connection.end();



