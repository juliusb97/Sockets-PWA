const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
// const fs = require("fs");
// const https = require("https");
const execSync = require("child_process").execSync;

// const key = fs.readFileSync("./key.pem");
// const cert = fs.readFileSync("./cert.pem");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.static("public"));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

app.get("/", function(req, res){
	
	let action, no;
	if(req.query.action || req.query.no){
		
		console.log("Socket action: action = " + req.query.action  + " no = " + req.query.no);
		
		action = req.query.action;
		no = req.query.no;

		if(action == "on" || action == "off"){
			exec("/home/pi/wiringPi/433Utils/SocketControl " + req.query.no + " " + ((req.query.action=="on") ? "1" : "0"), (i,j,k) => {return;});
		} else if(action == "turnon" || action == "turnoff"){
			exec("/home/pi/wiringPi/433Utils/SocketControl " + ((req.query.action=="turnon") ? "-on" : "-off"), (i,j,k) => {return;});
		}

		res.end();
		return;
	}

	let file = "index.html"
	
	console.log("Request root");
	res.sendFile(file, { root: __dirname });
});

// app.get("/:file", function(req, res) {
	
// 	let file = "index.html"
// 	if(req.params.file)
// 		file = req.params.file;
	
// 	console.log(file);
// 	res.sendFile(file, { root: __dirname });
// })

app.listen(4269);

// const server = https.createServer({key: key, cert: cert}, app);

// server.listen(4269);