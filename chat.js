$( document ).ready(function() {
    chatRef = new Firebase("https://poopurl.firebaseio.com/chats");
});

function createChatData(name,isPublic,url){
    console.log("open"+url);
    var user = chatRef.getAuth();
    var uid = user.uid;
    var json = {'messages': {}, 'name': name, 'public': isPublic, 'users': {}};
    json['users'][uid] = true;
    if (url == ''){
        newChat = chatRef.push(json,createChatCallback);
    }
    else {
        chatRef.child(url).set(json,createChatCallback);
        newChat = undefined;
        newUrl = url;
    }


}

function createChatCallback(e){
    if (e == null) {
        console.log("completed");

        var url = window.location.href;

        var lastchar = url.slice(-1);
        if (lastchar != '/'){
            var dash = '/';
        }
        else {
            var dash = '';
        }
        if (newChat != undefined){
            var key = newChat.key();
        }
        else {
            var key = newUrl;
        }
        window.location.href = window.location.href +dash+key;

    } else {
        console.log("failure");
    }
}


function createChat(){
    var content = $("#new-chat-dialog").clone();
    vex.dialog.open({
        message: 'Enter the chat name:',
        input: content,
        afterOpen: addNewChatListener,
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
                text: 'Create chat'
            }), $.extend({}, vex.dialog.buttons.NO, {
                text: 'Cancel'
            })
        ],
        callback: function(data) {
            if (data === false) {
                return console.log('Cancelled');
            }
            else {
                var isPublic = (data.public != undefined) ? true : false;

                createChatData(data.name,isPublic,data.url);
            }

        }

    });


}

function addNewChatListener(){

    $( ".vex .custom-url-text" ).keyup(function() {
        console.log( "Handler for .keypress() called." );
        var customUrl = $(this).val().toLowerCase();
        console.log(customUrl);
        chatRef.child(customUrl).once('value', function(snapshot) {
            console.log("got callback");
            var exists = (snapshot.val() !== null);
            if (exists){
                $(".custom-url-text").addClass("invalid");
                $(".vex .custom-url-prevent").attr("required", true);
            }
        });
        $(".custom-url-text").removeClass("invalid");
        $(".vex .custom-url-prevent").attr("required", false);
    });

    $( ".vex .custom-url-box" ).change(function() {
        console.log("doing");
        input = $( ".vex .custom-url-text" );
        if(this.checked){
            input.show();
            input.val("");
            input.attr("required", true);

            console.log("showin");
        }
        else {
            input.hide();
            input.val("");
            input.attr("required", false);
            $(".custom-url-text").removeClass("invalid");
            $(".vex .custom-url-prevent").attr("required", false);
        }

    });

    $(".vex form").submit(function( event ) {

    });
    console.log("adding listener");
}