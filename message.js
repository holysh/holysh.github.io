$( document ).ready(function() {
    console.log("broke");
    messagesRef = new Firebase("https://poopurl.firebaseio.com/messages");

    var url = getURL();
    var chat = url[url.length-1];
    if (!(url.length > 1 && chat != null && chat != "")) {
        chat = "default";
    }
    
    chatRef.child(chat).child('messages').orderByChild("timestamp").limitToLast(10).on("child_added", setMessage);

    $("#input-text").keypress(function (e) {
        if (e.which == 13) {
            sendMessage();
            return false;
        }
    });

});



function sendMessage(){
    var input = $("#input-text");
    var text = input.val();
    if(text.length > 1){
        input.val('');

        console.log("sending: "+text);
        var now = Firebase.ServerValue.TIMESTAMP;

        var url = getURL();
        var chat = url[url.length-1];
        
        if (!(url.length > 1 && chat != null && chat != "")) {
            chat = "default";
        }

        var content = {'message':text,'timestamp':now};
        if(chatRef.getAuth() != null){
            content['author'] = chatRef.getAuth().uid;
        }

        chatRef.child(chat).child('messages').push(content, function(e) {
            if (e != null) {
                console.log("failed");
            }
        });
    }
}

function setMessage(data) {
    var message = data.val().message;

    var regex = (/\.(gif|jpg|jpeg|tiff|png)$/i);
    if (regex.test(message)){
        //url
        var el = $("<p class='message'><img src="+message+"></p>");
    }
    else {
        //is plain
        var el = $("<p class='message'></p>").text(message);
    }


    el.prependTo('#history').hide().slideDown();
    var children = $("#history").children();
    if( children.length > 10){
        children.last().remove();
    }
}

function getURL() {
    var urlArray = window.location.pathname.split( '/' );
    return urlArray;
}
