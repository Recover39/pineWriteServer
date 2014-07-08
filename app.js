/**
 * Created by YoungKim on 2014. 7. 7
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    cluster = require('cluster'),
    threadFunction = require('./worker/thread'),
    multer = require('multer');

//cluster 모듈 사용을 위한 cpu 갯수 확인
var numCPUs = require('os').cpus().length;

//cluster 사용시작
if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    // express 객체 생성
    var app = express(),
        server = http.createServer(app);

    //rabbitMQ 에서 작업을 받아오기 위한 worker 생성
    var worker1 = require('./worker/queueWorker'),
        worker2 = require('./worker/queueWorker');

    // express 환경 설정
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.set('view option', { layout: false });
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.bodyParser());
    app.use(express.cookieParser('secretKey'));
    //image processing
    app.use(multer({ dest: 'images'}));
    app.use(express.static(path.join(__dirname, 'public')), {maxAge: 30 * 24 * 60 * 60 * 1000});
    app.use(express.methodOverride());
    app.use(express.compress());
    //csrf 방어
    //app.use(require('csurf')());

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

    server.listen(app.get('port'), function () {
        console.log('\n//////////////////////////////////////////////////\n' +
            '//// pine_write Server listening on port ' + app.get('port') + ' ////' +
            '\n//////////////////////////////////////////////////');
    });

    //worker 작동 시작
    worker1();
    worker2();
}