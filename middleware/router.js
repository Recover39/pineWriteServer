/**
 * Created by YoungKim on 2014. 8. 11..
 */
var threadFunction = require('../worker/thread');

exports.route = function (app) {

    //test page
    app.get('/', function (req, res) {
        res.render('test');
    });

    //request relation with thread (card)
    app.post('/threads', threadFunction.postNewCard);

    app.post('/threads/:thread_id/like', threadFunction.likeThread);
    app.post('/threads/:thread_id/unlike', threadFunction.unlikeThread);
    app.post('/threads/:thread_id/report', threadFunction.reportThread);
    app.post('/threads/:thread_id/block', threadFunction.blockThread);
    app.post('/threads/:thread_id/comments', threadFunction.addComment);

    app.post('/comments/:comment_id/like', threadFunction.likeComment);
    app.post('/comments/:comment_id/unlike', threadFunction.unlikeComment);
    app.post('/comments/:comment_id/report', threadFunction.reportComment);
    app.post('/comments/:comment_id/block', threadFunction.blockComment);
};