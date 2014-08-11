/**
 * Created by YoungKim on 2014. 7. 7
 */

'use strict';

//set basic express module
var express = require('express'),
    http = require('http'),
    path = require('path'),
    cluster = require('cluster');

//cluster 모듈 사용을 위한 cpu 갯수 확인
var numCPUs = require('os').cpus().length;

//custom middleware
var router = require('./middleware/router');

//여러개의 포트에서 리슨하기 위해 만들어준다.
var ports = [3000, 3001, 3002, 3003],
    servers = [];

//cluster 사용시작
if (cluster.isMaster) {
    //init queue one time
    (function () {
        //create rabbitMQ connection
        var rabbit = require('amqp'),
            connection = rabbit.createConnection({
                host: 'localhost', port: 5671,
                login: 'admin', password: 'password',
                authMechanism: 'AMQPLAIN'
//                , vhost: '/'
//                , ssl: { enabled : true
//                    , keyFile : '/path/to/key/file'
//                    , certFile : '/path/to/cert/file'
//                    , caFile : '/path/to/cacert/file'
//                    , rejectUnauthorized : true
            });

        //make queue
        connection.on('ready', function () {
            // declare queue
            var requestQueueList = ['requestQueue'];

            requestQueueList.forEach(function (queue) {
                connection.queue(queue, {autoDelete: false, durable: true}, function (queue) {
                    console.log('\n///////////////////////////\n' +
                        '/// init ' + queue + ' complete ///\n' +
                        '///////////////////////////\n');
                });
            });
        });

        //make queue fail, auto reconnect
        connection.on('error', function () {
            console.log('fail to connect rabbitmq server -- try to reconnect');
        });
    })();

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    ports.forEach(function (port) {
        // express 객체 생성
        var app = express(),
            server = http.createServer(app);

        // express 환경 설정
        app.set('port', process.env.PORT || port);
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.cookieParser('secretKey'));
        app.use(express.static(path.join(__dirname, 'public')),
            {maxAge: 30 * 24 * 60 * 60 * 1000});
        app.use(express.methodOverride());
        app.use(express.compress());
        //csrf 방어
        //app.use(require('csurf')());

        app.use(app.router);

        //404 error
        app.use(function (req, res, next) {
            res.contentType('application/json');
            res.send({result: "FAIL", message: 'route error'});
        });

        //500 error
        app.use(function (err, req, res, next) {
            res.contentType('application/json');
            res.send({result: "FAIL", message: 'server error'});
        });

        //route
        router.route(app);

        server.listen(app.get('port'), function () {
            console.log('\n//////////////////////////////////////////////////\n' +
                '//// pine_write Server listening on port ' + app.get('port') + ' ////' +
                '\n//////////////////////////////////////////////////');
        });
    });
}