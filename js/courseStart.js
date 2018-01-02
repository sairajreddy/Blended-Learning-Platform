// JavaScript source code

var rendered = false;
function getVideo(lesson1)
{
    var lesson;
    if (lesson1)
        lesson = lesson1;
    else
        lesson = window.event.srcElement.id;
    xhr = new XMLHttpRequest();
    xhr.open("get", "http://localhost:8080?request=getVideo&course=" + course + "&lesson=" + lesson, true);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.response;
            var video = document.getElementById("lectureVideo");
            video.name = lesson;
            video.src = window.URL.createObjectURL(data);
            video.play();
        }
    };
    xhr.send();
   
}
function renderPanel(data)
{
    if (!rendered)
    {
        lessons = data.split("\n");
        var panelStart = document.getElementById("start1");
        panelStart.getElementsByTagName("p")[0].innerHTML = lessons[0];
        panelStart.getElementsByTagName("img")[1].id = lessons[0];
        panelStart = panelStart.cloneNode(true);
        var video = panelStart.getElementsByClassName("video")[0];
        panelStart.removeChild(video);
        for (var i = 1; i < lessons.length && lessons[i] != "done"; i++) {
            var temp = panelStart.cloneNode(true);
            temp.getElementsByTagName("p")[0].innerHTML = lessons[i];
            temp.getElementsByTagName("img")[1].id = lessons[i];
            temp.id = "start" + (i + 1);
            document.getElementById("playlist").appendChild(temp);

        }
        getVideo(lessons[0]);
        rendered = true;
    }
   
}
function loadQuestion(name)
{
    jQuery.get("http://localhost:8080?request=loadQuestion&course=" + course + "&name=" + name, function (data) {
        jQuery("#question").text(data);
    });
}
function changeVideo() {
    
    var nextVideo = document.getElementById("nextVideo");
    var video = document.getElementById("lectureVideo");
    var img = document.getElementById(video.name);
    img.parentElement.parentElement.className = 'highlight';
    temp = video.name;
    video.src = nextVideo.src;
    video.name = nextVideo.name;
    //video.play();
    nextVideo.src = "";
    nextVideo.name = "";
    loadQuestion(temp);

}
function getNextVideo()
{
    var video = document.getElementById("lectureVideo");
    if (!video.paused)
    {
        var curSrc = document.getElementById("lectureVideo").name;
        var nextSrc = lessons[(lessons.indexOf(curSrc)) + 1];
        if (nextSrc) {
            xhr = new XMLHttpRequest();
            xhr.open("get", "http://localhost:8080?request=getVideo&course=" + course + "&lesson=" + nextSrc, true);
            xhr.responseType = "blob";
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var data = xhr.response;
                    var video = document.getElementById("nextVideo");
                    video.name = nextSrc;
                    video.src = window.URL.createObjectURL(data);
                    //alert("next video src set");
                   
                }
            };
            xhr.send();
        }

    }
        
}

window.onload = function() {
    //alert("something");
    
    course = document.getElementById("course").title;
    //alert(course);
    document.getElementById("heading").innerHTML+=course;
    jQuery.get("http://localhost:8080?request=panelData&course=" + course, renderPanel);
    jQuery("start1").click(function (event) {
        alert(event.target.id);
    });
    document.getElementById("lectureVideo").poster = "./images/" + course + ".png";
    jQuery("#lectureVideo").on("loadeddata", function () {
        //alert(this.currentTime);
        setTimeout(getNextVideo, this.duration / 2 * 1000);
    });
    jQuery("#lectureVideo").on("ended", changeVideo);
    jQuery("#lectureVideo").click(function () {
        alert("you clicked");
        var video = document.getElementById("lectureVideo");
        video.play();
    });
    //alert("./images/" + course + ".png");
    document.getElementById("panelIcon").src = "./images/" + course + ".png";
    //Multistage download
    jQuery.get("http://localhost:8080?request=panelData&course=" + course, renderPanel);
   
};