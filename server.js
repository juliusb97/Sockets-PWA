const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require("fs");

const PORT = 4269;
const URL = "localhost";

function log(msg, type) {
	if(type == "warning") console.warn(`[${new Date().toISOString()}] ${msg}`);
	else if(type == "error") console.error(`[${new Date().toISOString()}] ${msg}`);
	else console.log(`[${new Date().toISOString()}] ${msg}`);
}

log(`Started server at ${URL}:${PORT}`);

//Read config
let config = {
	targetUrl: "http://localhost",
	targetPort: "6969"
};

try {
	config = JSON.parse(fs.readFileSync(__dirname + "/config/sockets-pwa.json"));
} catch(e) {
	log("Could not read config, reverting to default", "warn");
}


const app = express();
app.use(cors());

//Log all requests
app.use((req, res, next) => {
	log(`Received request from ${req.ip} for url ${req.url}`);
	next();
});

//server PWA
app.use(express.static("public"));

//silence CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

//Proxy switch requests
app.get("/switch/*", createProxyMiddleware({
		target: `${config.targetUrl}:${config.targetPort}/`,
		changeOrigin: false,
		pathRewrite: {
			"^/switch": ""
		}
	}
));

//provide some info
app.get("/info", (req, res) => {

	res.write("SocketServer PWA to control my 433Mhz sockets.\r\n");
	res.send();

});

app.listen(PORT);