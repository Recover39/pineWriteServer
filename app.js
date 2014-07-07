/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    cluster = require('cluster');

var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    var app = express(),
        server = http.createServer(app);

// all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

// development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    app.get('/', routes.index);
    app.get('/users', user.list);

    server.listen(app.get('port'), function () {
        console.log('\n///////////////////////////////////////////////\n' +
            '//// Express server listening on port ' + app.get('port') + ' ////' +
            '\n///////////////////////////////////////////////');
    });
}