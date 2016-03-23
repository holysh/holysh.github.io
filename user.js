$( document ).ready(function() {
    console.log("ready 4 sure");
    ref = new Firebase("https://poopurl.firebaseio.com/users");
    ref.onAuth(authDataCallback);
    $("#new-chat-button").click(function(){createChat();});

});

function login(){
    ref.authWithOAuthPopup("google", function(error, authData){});
}

function logout(){
    ref.unauth();
}

function authDataCallback(authData) {
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        checkUserExist(authData);
        setLoggedIn();
    } else {
        console.log("User is logged out");
        setLoggedOut();
    }
}


function setLoggedIn(){
    $("#new-chat-button").slideDown();
    var button = $("#login-button");
    button.unbind( "click" );
    button.slideDown();
    button.text("Logout");
    button.click(function(){
        logout();
    });
}

function setLoggedOut(){
    $("#new-chat-button").slideUp();
    var button = $("#login-button");
    button.unbind( "click" );
    button.text("Login");
    button.slideDown();
    button.click(function(){
        login();
    });
}

function checkUserExist(authData){

    ref.once("value", function(snapshot) {
        if (snapshot.child(authData.uid).exists()){
            console.log("uzser existiert");
        }
        else {
            createUser(authData);
        }
    });
}

function createUser(authData){
    vex.dialog.open({
        message: 'Welcome You can choose your nickname:',
        input: "<input name=\"name\" type=\"text\" placeholder=\"Name\" required />",
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
                text: 'login'
            })
        ],
        callback: function(data) {
            if (data === false) {
                logout();
                return console.log('Cancelled');

            }
            else {
                var uid = authData.uid;
                var now = Firebase.ServerValue.TIMESTAMP;
                ref.child(uid).set({
                    register_date: now,
                    nickname: data.name
                });
            }

        }

    });
}

function createChat(){
    //todo
    vex.dialog.open({
        message: 'Enter the chat name:',
        input: "<input name=\"name\" type=\"text\" placeholder=\"Name\" required autocomplete=\"off\"/>\n<label><input name=\"public\" type=\"checkbox\" />Public Chat</label>",
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
                createChatData(data.name,isPublic);
            }

        }

    });
}



function authHandler(error, authData) {
    if (error) {
        console.log("Login Failed!", error);
    } else {
        console.log("Authenticated successfully with payload:", authData);
    }
}

