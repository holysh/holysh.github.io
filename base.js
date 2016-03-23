
var completeScroll = true;

$( document ).ready(function() {
    console.log( "ready!" );
    myFirebaseRef = new Firebase("https://poopurl.firebaseio.com/light");
    statusBG = 'new';
    complete = 0;

    var urlArray = window.location.pathname.split( '/' );
    console.log("url"+urlArray[urlArray.length -1 ]);

    lastScrollTop = 0;








    initFireCallback();

    $('<img/>').attr('src', 'https://images.unsplash.com/reserve/rVvIisyfQwOhZv35PPhh_unsplash.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=500&h=200&fit=crop&s=795966a9c47dcf65ffb9bd5a369a36d9').load(function() {
        $(this).remove();
        $("#button").css('background-image', 'url(https://images.unsplash.com/reserve/rVvIisyfQwOhZv35PPhh_unsplash.jpg?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=500&h=200&fit=crop&s=795966a9c47dcf65ffb9bd5a369a36d9)');
        complete++;
        siteLoaded();
        scrollListener();
    });




});

function togglePoop(){
    statusBG = !statusBG;
    myFirebaseRef.update({state: statusBG});
}


function siteLoaded(){
    if(complete >= 2){
        $(".spinner").hide();
        $("#button").show('fade',{ percent: 100 },500).css("display", "inline-block");
        $("#button").addClass("unblur");
        $("#content-container").show();
    }

}

function updateCSS(newStatus){
    var color = newStatus == true ? "#F2F2F2" : "#121212";
    console.log("the color is "+color+" and status: "+newStatus);
    $("#full-container").stop();
    $("#full-container").animate({backgroundColor: color},1000,'linear');
}

function initFireCallback(){
    myFirebaseRef.on("value", function(snapshot) {
        console.log(statusBG);
        if (statusBG == 'new'){
            complete++;
            siteLoaded();
        }
        statusBG = snapshot.val().state;
        updateCSS(statusBG);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}


function scrollListener(){

    $( window ).scroll(function() {
        var st = $(this).scrollTop();
        if (completeScroll){
            if (st > lastScrollTop){
                if( st < $("#content").offset().top && st > 40){
                    console.log("scrolling to div");
                    completeScroll = false;
                    $('body,html').stop();
                    $('body,html').animate(
                        { scrollTop: $("#content-container").offset().top},
                        {complete: function(){
                            completeScroll = true;
                        }},
                        500);
                }


            } else {
                if( st < $("#content").offset().top && st > 40){
                    completeScroll = false;
                    $('body,html').stop();
                    $('body,html').animate(
                        { scrollTop: 0},
                        {complete: function(){
                            completeScroll = true;

                        }},
                        500);
                }



            }
        }


        lastScrollTop = st;

    });

}