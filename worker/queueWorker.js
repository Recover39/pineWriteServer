/**
 * Created by YoungKim on 2014. 7. 7..
 */

//rabbitmq setting
var amqp = require('amqp');
var connection = amqp.createConnection({host: 'localhost'});

var init = function () {
    //rabbitMQ connect
    connection.on('ready', function () {
        //upload new card query
        connection.queue('newCardQueue', {autoDelete: false, durable: true}, function (queue) {
            queue.subscribe({ack: true, prefetchCount: 1}, function (msg) {
                console.log(msg);
                console.log("Done");
                queue.shift(); // 한 번에 하나만 받아서 처리한다.
            });
        });

        //upload new card (text only) query
        connection.queue('queue', {autoDelete: false, durable: true}, function (queue) {
            queue.subscribe({ack: true, prefetchCount: 1}, function (msg) {
                console.log(msg);
                console.log("Done");
                queue.shift();
            });
        });

        //like query
        connection.queue('queue', {autoDelete: false, durable: true}, function (queue) {
            queue.subscribe({ack: true, prefetchCount: 1}, function (msg) {
                console.log(msg);
                console.log("Done");
                queue.shift();
            });
        });

        //unlike query
        connection.queue('queue', {autoDelete: false, durable: true}, function (queue) {
            queue.subscribe({ack: true, prefetchCount: 1}, function (msg) {
                console.log(msg);
                console.log("Done");
                queue.shift();
            });
        });

        //report query
        connection.queue('queue', {autoDelete: false, durable: true}, function (queue) {
            queue.subscribe({ack: true, prefetchCount: 1}, function (msg) {
                console.log(msg);
                console.log("Done");
                queue.shift();
            });
        });
    });
};

module.exports = init;
