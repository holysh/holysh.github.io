$( document ).ready(function() {
    chatRef = new Firebase("https://poopurl.firebaseio.com/chats");
});

function createChatData(name,isPublic){
    console.log("open"+open);
    var user = chatRef.getAuth();
    var uid = user.uid;
    var json = {'messages': {}, 'name': name, 'public': isPublic, 'users': {}};
    json['users'][uid] = true;
    var newChat = chatRef.push(json, function (e) {
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
            var key = newChat.key();
            window.location.href = window.location.href +dash+key;

        } else {
            console.log("failure");
        }
    });

}
