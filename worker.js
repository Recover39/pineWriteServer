/**
 * Created by YoungKim on 2014. 7. 8..
 */

var rabbit = require('amqp');

var connection = rabbit.createConnection({host: 'localhost'});

//threadLikeQueue
connection.on('ready', function () {
    connection.queue('threadLikeQueue', {autoDelete: false, durable: true}, function (queue) {
        console.log(' [*] Waiting for messages. To exit press CTRL+C');

        queue.subscribe({ack: true, prefetchCount: 1}, function (msg) {
            console.log(msg);
            console.log(" [x] Done");
            queue.shift(); // basic_ack equivalent
        });
    });
});

