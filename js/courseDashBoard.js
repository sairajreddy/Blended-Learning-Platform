// JavaScript source code
timer = null;
function openWindowJS()
{
    //alert(window.event.srcElement.name);
    child = window.open("courseStart.html", 'myWindow');
    
}
function openWindowJava() {
    //alert(window.event.srcElement.name);
    child = window.open("courseStart1.html", 'myWindow');

}
function fetchData()
{
    //alert("fetchData is called");
    parameters = $("#searchStr").val();
    if (parameters != ' ')
    {
        $.get("http://localhost:8080/?request=fetchSearch&input=" + parameters, renderDiv);
    }   
}
function renderDiv(data)
{
    var myNode = document.getElementById("search");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    var sug = data.split('\n');
    for (var i = 0; i < sug.length; i++)
    {
        var p = document.createElement('div');
        p.className = 'suggestion';
        p.onmousedown = function () {
            document.getElementById("searchStr").value = this.innerHTML;
        };
        p.innerHTML = sug[i];
        document.getElementById('search').appendChild(p);
    }
    //document.getElementById('search').innerHTML = data;
}
$(document).ready(function () {
    $("#searchStr").focus(function () {
        timer = setInterval(fetchData, 2000);
    });
    $("#searchStr").blur(function () {
        var myNode = document.getElementById("search");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        clearInterval(timer);
    });
});
