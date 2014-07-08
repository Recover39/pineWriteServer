/**
 * Created by YoungKim on 2014. 7. 8..
 */

var upload = function (e) {
    var request = new XMLHttpRequest();

    var file = document.getElementById("uploadfile");

    /* Create a FormData instance */
    var formData = new FormData();
    /* Add the file */
    formData.append("upload", file.files[0]);

    request.open("post", "/threads", true);
    request.setRequestHeader("Content-Type", "multipart/form-data");
    request.send(formData);  /* Send to server */
};

var post = function (e) {
    e.preventDefault();

    console.log('data');

    var curForm = e.currentTarget.form,
        request = new XMLHttpRequest(),
        url = "/threads",
        formData = new FormData(),
        photo = document.getElementById('photo');

    var message = {
        author: curForm[0].value,
        is_public: curForm[1].value,
        content: curForm[2].value
    };

    var sendMessage = JSON.stringify(message);

    formData.append('upload', photo.files[0]);

    request.open('POST', url, true);

    request.setRequestHeader("Content-type", "multipart/form-data");

    request.send(sendMessage);
};

var postText = function (e) {
    e.preventDefault();

    var curForm = e.currentTarget.form,
        request = new XMLHttpRequest(),
        url = "/threads";

    var message = {
        author: curForm[0].value,
        is_public: curForm[1].value,
        content: curForm[2].value
    };

    var sendMessage = JSON.stringify(message);

    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/json");

    request.send(sendMessage);
};

var like = function (e) {
    e.preventDefault();

    var curForm = e.currentTarget.form,
        request = new XMLHttpRequest(),
        url = "/threads/1/like";

    var message = {
        user: curForm[0].value
    };

    var sendMessage = JSON.stringify(message);

    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/json");

    request.send(sendMessage);
};

var unlike = function (e) {
    e.preventDefault();

    var curForm = e.currentTarget.form,
        request = new XMLHttpRequest(),
        url = "/threads/1/unlike";

    var message = {
        user: curForm[0].value
    };

    var sendMessage = JSON.stringify(message);

    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/json");

    request.send(sendMessage);
};

var report = function (e) {
    e.preventDefault();

    var curForm = e.currentTarget.form,
        request = new XMLHttpRequest(),
        url = "/threads/1/report";

    var message = {
        user: curForm[0].value
    };

    var sendMessage = JSON.stringify(message);

    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/json");

    request.send(sendMessage);
};

//document.getElementById('postButton').addEventListener('click', post, true);
document.getElementById('postTextButton').addEventListener('click', postText, true);
document.getElementById('likeButton').addEventListener('click', like, true);
document.getElementById('unlikeButton').addEventListener('click', unlike, true);
document.getElementById('reportButton').addEventListener('click', report, true);