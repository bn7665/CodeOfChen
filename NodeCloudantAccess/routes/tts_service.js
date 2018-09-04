
var express = require('express');
var router = express.Router();
const fs = require('fs');
const http = require('http');
const url = require('url');
const toWav = require('audiobuffer-to-wav');
const AudioContext = require('web-audio-api').AudioContext;
const audioContext = new AudioContext;
var querystring = require('querystring');

router.get('/', function(req, res, next) {
	
	var post_data = querystring.stringify({
	  "text": req.query.text?req.query.text:"真是夠了。。哥的心好累累累累"
	});
	let options  = require('url').parse("http://vois3.cyberon.com.tw/cloud_tts/gen_tts_content.php");
	options.method = 'POST';
	options.headers = {
		'Content-Type': 'application/x-www-form-urlencoded'//,
		//'Content-Length': Buffer.byteLength(post_data)
	};

	var post_req = http.request(options, function(resq) {
	  resq.setEncoding('utf8');
	  resq.on('data', function (chunk) {
		  console.log('Response: ' + chunk);
		  res.send(new Date(Date.now()+1000*3600*8).toISOString()+"<br>"+chunk);
	  });
	});

	post_req.write(post_data);
	post_req.end();

	/*
	http://pwtthemes.com/demo/hannari/wp-content/uploads/2013/03/unicorn-wallpaper.jpg
	
	
	let type = req.query.type;
	let audio_url = req.query.audio_url?Buffer.from(req.query.audio_url, 'base64').toString():"";
	let token = req.query.token?Buffer.from(req.query.token, 'base64').toString():"";

	//https://cdn.fbsbx.com/v/t59.3654-21/36082939_1854996711210208_8184318988667322368_n.mp4/audioclip-1530760840000-4480.mp4?_nc_cat=0
	let options  = require('url').parse(audio_url);//options  = url.parse('https://cdn.fbsbx.com/v/t59.3654-21/36082939_1854996711210208_8184318988667322368_n.mp4/audioclip-1530760840000-4480.mp4?_nc_cat=0&oh=8feb1c5487552be37e013517f74621ca&oe=5B408F2D');
	if(type=="line"){
		options.headers={
			"Content-Type": "application/json",
				"Authorization": "Bearer "+token
		};
	}

	https.get(options, function(resp) {
		var data = [];
		resp.on('data', function(chunk) {
			data.push(chunk);
		}).on('end', function() {
			//at this point data is an array of Buffers
			//so .cBufferoncat() can make us a new Buffer
			//of all of them together
			var buffer = Buffer.concat(data);
			doWithBuffer(buffer,function(result){
				res.send(result);
			});
			
		});
	});*/
});

module.exports = router;

function doWithBuffer(resp,callback){
	audioContext.decodeAudioData(resp, buffer => {
		let wav = toWav(buffer);
		var W3CWebSocket = require('websocket').w3cwebsocket;
		var client = new W3CWebSocket('wss://vr2.cyberon.com.tw/CyberonSTT/');
		let first = true;
		client.onmessage = function(e) {
			if (typeof e.data === 'string') {
				console.log("Received: '" + e.data + "'");
				let receive_msg = JSON.parse(e.data);
				if(receive_msg.state=="listening"&& first){
					first =false;
					client.send(JSON.stringify({
						"action":"start",
						"domain":"freeSTT-zh-TW",
						"platform":"web",
						"uid":"g4ru04",
						"token":"VRIm8OIz9PnwuragczvYQos0Z4TKSShlmjEDzVfk-1Gok1fDmRpZSLviyCbEtpJZvEVYXw7kaULXawH0YqHqhI8D6Jviy-Gy7QQyIHUbke2FufamVh9gJcF8rZ1tqGlQ",
						"type":"audio/wav"
					}));
					client.send(wav);
					client.send(JSON.stringify({"action" : "stop"}));
				}else if(receive_msg.state=="result"){
					callback(receive_msg.recog_result);
					client.close();
				}else if(receive_msg.err_msg!=null){
					callback(receive_msg.err_msg);
					client.close();
				}
				
			}
		};
		client.onopen = function() {
			console.log('WebSocket Client Connected');
		};
	});
}

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

