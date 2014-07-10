/**
 * Created by YoungKim on 2014. 7. 11..
 */

var amqp = require('amqp');
var connection = amqp.createConnection({host: 'localhost'});
var count = 1;

connection.on('ready', function () {
    connection.queue('queue', {autoDelete: false, durable: true}, function (queue) {
        console.log('start gathering');
        queue.subscribe({ack: true, prefetchCount: 1}, function (msg) {
            console.log(count);
            count++;
            queue.shift();
        });
    });
});
