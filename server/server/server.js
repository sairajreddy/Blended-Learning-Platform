var http = require('http');
var fs = require('fs');
var url = require("url");
var events = require("events");
var eventEmitter = new events.EventEmitter();
var dir = require('node-dir');
var port = 8080;
var path = "C:/Users/Varsha/Documents/Semester 6/Web Technology/Project/";
var qs = require('querystring');
//register event handlers
eventEmitter.addListener("fetchSearch", fetchSearch);
eventEmitter.addListener("panelData", panelData);

function fetchSearch(res, inp) {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('./resources/languages.txt')
    });
    lineReader.on('line', function (line) {
        if (line.toUpperCase().startsWith(inp.toUpperCase()))
            res.write(line+"\n");
    });
    lineReader.on('close', function () { res.end(); });
}
function panelData(res, course) {
    dir.files(path + course, function (err, files) {
        files.sort(function (a, b) {
            var temp1 = a.split("\\");
            var temp2 = b.split("\\");
            temp1 = temp1[temp1.length - 1].split('-')[0];
            temp2 = temp2[temp2.length - 1].split('-')[0];
            return parseInt(temp1) - parseInt(temp2);
        });
        //console.log(files);
        for (var i = 0; i < files.length; i++) {
            var temp = files[i].split('\\');
            temp = temp[temp.length - 1];
            if(temp.indexOf(".txt")==-1)
                res.write(temp.substring(0, temp.length-4) + "\n");
        }
       
        res.end("done");
    });
    
}
function getVideo(res, course, lesson) {
    var file = path + course + "/" + lesson + ".mp4";
    console.log(file);
    res.writeHead(200, { 'Content-Type': 'blob' });
    fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
}
function loadQuestion(res, course, name) {
    var file = path + course + "/" + name + ".txt";
    fs.readFile(file, function (err, contents) {
        res.end(contents.toString());
    });
}
function getDiscussion(res) {
    fs.readFile('C:/Apache24/htdocs/Project/chat.txt', function (err, contents) {
        //console.log(err);
        console.log(contents.toString());
        res.end(contents.toString());
    });
}
function handleGetRequests(req, res) {
    //console.log("get handler is called");
    var parts = url.parse(req.url, true);
    var request = parts.query.request;
    if (request == "fetchSearch") {
        var input = parts.query.input;
        eventEmitter.emit("fetchSearch", res, input);
    }
    else if (request == "panelData") {
        eventEmitter.emit("panelData", res, parts.query.course)
    }
    else if (request == "getVideo") {
        getVideo(res, parts.query.course, parts.query.lesson);
    }
    else if (request == "loadQuestion") {
        loadQuestion(res, parts.query.course, parts.query.name);
    }
    else if (request == "getDiscussion") {
        getDiscussion(res);
    }
}
function compileCode(POST, res) {
    var lang = POST['language'];
    var code = POST['code'];
    if (lang == 'Python') {
        fs.writeFile('input.py', code, function (err) {
            var child = require('child_process').execFile('python',
                ['input.py'], function (err, stdout, stderr) {
                    if (stderr == '') {
                        res.write("Compiled successfully\n");
                        res.end("Output: " + stdout);
                    }
                    else {
                        res.write("Syntax Error\n");
                        res.end(stderr);
                    }
                });

        });
    }
    else if (lang == 'Java') {
        fs.writeFile('input.java', code, function (err) {
            var child = require('child_process').execFile('javac',
                ['input.java'], function (err, stdout, stderr) {
                    if (stderr == '') {
                        res.write("Compiled successfully\n");
                        var child = require('child_process').execFile('java',['input'], function (err, stdout, stderr) {
                                           res.end(stdout)
                     });
                    }
                    else {
                        res.write("Syntax Error\n");
                        res.end(stderr);
                    }
                });

        });
    }

  
}

http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');    
    if (req.method === "GET") {
        handleGetRequests(req, res);
    }
    if (req.method === "POST") {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var POST = qs.parse(body);
            compileCode(POST, res);
        });
    }

}).listen(8080);