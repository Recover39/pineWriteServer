/**
 * Created by YoungKim on 2014. 7. 7..
 */

//send singleClickQuery to queue
var singleClickQuery = function (action, queueName, request, response) {
    var reqContentType = request.get('Content-Type');

    if (reqContentType === 'application/json') {
        //rabbitMQ setting
        var rabbit = require('amqp');
        var connection = rabbit.createConnection({host: 'localhost'});

        //set queue name, action name (identifier)
        var mQueryAction = String(action),
            mQueueName = String(queueName);

        //data to send
        var message = {
            thread_id: request.params.thread_id,
            user: request.body.user,
            time: new Date(),
            action: mQueryAction
        };

        //use rabbitMQ
        connection.on('ready', function () {
            //open queue (createQueue)
            connection.queue(mQueueName, {autoDelete: false, durable: true}, function () {
                //insert queue
                connection.publish(mQueueName, message);

                //success
                response.contentType('application/json');
                response.send({result: "SUCCESS"});
            });
        });
    }
    //Content-Type error
    else {
        //fail
        response.contentType('application/json');
        response.send({result: "FAIL", message: 'error message'});
    }
};

//send card info without photo to queue
var textOnlyNewCardQuery = function (request, response) {

    //is_public field error detection
    if (request.body.is_public === 'true' || request.body.is_public === 'false') {
        //rabbitMQ setting
        var rabbit = require('amqp');
        var connection = rabbit.createConnection({host: 'localhost'});

        //data to send
        var message = {
            author: request.body.author,
            is_public: request.body.is_public,
            content: request.body.content,
            time: new Date(),
            action: 'writeNewCard_textOnly'
        };

        //use rabbitMQ
        connection.on('ready', function () {
            //open queue (createQueue)
            connection.queue('queue', {autoDelete: false, durable: true}, function () {
                //insert queue
                connection.publish('queue', message);

                //success
                response.contentType('application/json');
                response.send({result: "SUCCESS"});
            });
        });
    }
    //is_public field data error occurred
    else {
        //fail
        response.contentType('application/json');
        response.send({result: "FAIL", message: 'error message'});
    }
};

//send card info with card to queue -> not handle this at rabbitmq
var newCardQuery = function (request, response) {
    //rabbitMQ setting
    var rabbit = require('amqp');
    var connection = rabbit.createConnection({host: 'localhost'});

    //is_public 에러 감지
    //if (request.body.is_public === 'true' || request.body.is_public === 'false') {
    var message = {
        author: request.body.author,
        is_public: request.body.is_public,
        content: request.body.content,
        time: new Date(),
        action: 'writeNewCard'
    };

    //use rabbitMQ
    connection.on('ready', function () {
        //open queue (createQueue)
        connection.queue('newCardQueue', {autoDelete: false, durable: true}, function () {
            //insert queue
            connection.publish('newCardQueue', message);
        });
    });

    //success
    response.contentType('application/json');
    response.send({result: "SUCCESS"});
//    }
//    else {
//        //fail
//        response.contentType('application/json');
//        response.send({result: "FAIL", message: 'error message'});
//    }
};

exports.postNewCard = function (req, res) {
    var reqContentType = req.get('Content-Type');

    //console.log(req.get('Content-Type'));

    if (reqContentType === 'application/json') {
        textOnlyNewCardQuery(req, res);
    }
    else if (/multipart\/form-data;+/.test(reqContentType)) {
//        console.log('hello');
//        console.log(req.body);
//        console.log(req.files);
//        console.log(req.files.file.name);
//        console.log("file path", req.files.file.path);
//        newCardQuery(req, res);
    }
    //Content-Type error
    else {
        //fail
        res.contentType('application/json');
        res.send({result: "FAIL", message: 'error message'});
    }
};

exports.likeCard = function (req, res) {
    singleClickQuery('like', 'queue', req, res);
};

exports.unlikeCard = function (req, res) {
    singleClickQuery('unlike', 'queue', req, res);
};

exports.reportCard = function (req, res) {
    singleClickQuery('report', 'queue', req, res);
};
