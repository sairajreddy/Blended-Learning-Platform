// JavaScript source code
var msg;
obj = {
    send : function()
    {
        xhr = new XMLHttpRequest();
        xhr.open("Post", "saveChat.php", true);
        msg = document.getElementById('txt').value;
        document.getElementById('txt').value = '';
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("msg=" + msg);
        div = document.getElementById("accordion");
        var newDiv = div.cloneNode(true);
        newDiv.getElementsByClassName("txt")[0].innerHTML = "<strong>ME: </strong>"+msg;
        temp = document.getElementById("messages");
        temp.insertBefore(newDiv, temp.childNodes[0]);
        //alert('sent');
    },
    updateDiv : function(event)
    {
        //alert("update div is called"+ event.data);
        div = document.getElementById("accordion");
        newDiv = div.cloneNode(true);        
        if (msg && event.data != msg) {
            newDiv.getElementsByClassName("txt")[0].innerHTML= "<strong>Friend: </strong>"+event.data;
            temp = document.getElementById("messages");
            temp.insertBefore(newDiv, temp.childNodes[0]);
        }
    },

    getUpdate : function()
    {
        event = new EventSource("monitor.php");
        event.addEventListener("chatmsg", obj.updateDiv, false);
        //alert("in get update");
        $.get("http://localhost:8080?request=getDiscussion", function (data) {
            document.getElementsByClassName('txt')[0].innerHTML = "<strong>Friend: </strong>"+data;
            //alert(data);
        });
    }
  
}