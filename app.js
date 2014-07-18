/**
 * Created by YoungKim on 2014. 7. 7
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    cluster = require('cluster'),
    threadFunction = require('./worker/thread'),
    multer = require('multer'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    csrf = require('csurf');

var ports = [3000, 3001, 3002, 3003],
    servers = [];

//cluster 모듈 사용을 위한 cpu 갯수 확인
var numCPUs = require('os').cpus().length;

//cluster 사용시작
if (cluster.isMaster) {
    //init queue one time
    (function () {
        //rabbitMQ setting
        var rabbit = require('amqp');
        var connection = rabbit.createConnection({host: 'localhost'});

        //make queue
        connection.on('ready', function () {
            connection.queue('queue', {autoDelete: false, durable: true}, function (queue) {
                console.log('\n///////////////////////////\n' +
                    '/// init queue complete ///\n' +
                    '///////////////////////////\n');
            });
        });
    })();

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    //rabbitMQ 에서 작업을 받아오기 위한 worker 생성
    var worker1 = require('./worker/queueWorker'),
        worker2 = require('./worker/queueWorker');

    // express 객체 생성
    ports.forEach(function (port) {
        var app = express(),
            server = http.createServer(app);

        // express 환경 설정
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');
        app.set('view option', { layout: false });
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(cookieParser('pine_write'));
        //image processing
        app.use(multer({ dest: 'images'}));
        app.use(express.static(path.join(__dirname, 'public')), {maxAge: 30 * 24 * 60 * 60 * 1000});
        app.use(methodOverride());
        //app.use(compression());
        //csrf 방어
        app.use(csrf());

        app.use(app.router);

        app.use(function (req, res, next) {
            //404 error
            res.contentType('application/json');
            res.send({result: "FAIL", message: 'route error'});
        });

        app.use(function (err, req, res, next) {
            //500 error
            res.contentType('application/json');
            res.send({result: "FAIL", message: 'server error'});
        });

        //route

        //test page
        app.get('/', function (req, res) {
            res.render('test');
        });

        //user request
        app.post('/threads', threadFunction.postNewCard);
        app.post('/threads/:thread_id/like', threadFunction.likeCard);
        app.post('/threads/:thread_id/unlike', threadFunction.unlikeCard);
        app.post('/threads/:thread_id/report', threadFunction.reportCard);

        server.listen(port, function () {
            console.log('\n//////////////////////////////////////////////////\n' +
                '//// pine_write Server listening on port ' + port + ' ////' +
                '\n//////////////////////////////////////////////////');
        });

        servers.push(server);
    });

    //worker 작동 시작
    //worker1();
    //worker2();
}