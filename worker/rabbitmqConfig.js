/**
 * Created by YoungKim on 2014. 9. 1..
 */

'use strict';

var connectionConfig = {
    host: 'localhost', port: 5672,
    login: 'admin', password: 'password',
    authMechanism: 'AMQPLAIN'
};

var rabbitmq = (function () {
    //rabbitMQ setting
    var rabbit = require('amqp');
    var connection = rabbit.createConnection(connectionConfig);

    var getConn = function () {
        return connection;
    };

    return {
        getConn: getConn
    };
})();

module.exports = rabbitmq;