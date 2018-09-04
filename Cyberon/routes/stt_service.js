
var express = require('express');
var router = express.Router();
const fs = require('fs');
const https = require('https');
const url = require('url');
const logger = /*require('./helper/logger') ||*/ console;
const stream = require('stream');
const ffmpeg = require('fluent-ffmpeg');

router.get('/', function(req, res, next) {
	let audio_url = req.query.audio_url?Buffer.from(req.query.audio_url, 'base64').toString():"";
	console.log(audio_url);
	//console.log(token);
	//console.log(req.query);
	
	let options  = require('url').parse(audio_url);

	https.get(options, function(resp) {
		let temp_file = "/tmp/"+UUID()+".mp4";
		let streamhello=fs.createWriteStream(temp_file);
		resp.pipe(streamhello).on('finish', function () {
			//streamhello.close();
			//let temp_read = fs.createReadStream(temp_file);
			//var bufferStream = new stream.PassThrough();
			let outputFile = "/tmp/"+UUID()+".wav";
			callFfmpeg(temp_file,outputFile,function(metaData,stream){
				sendToWebsocket(outputFile,function(result){
					delete_file(temp_file);
					delete_file(outputFile);
					logger.log("detect as: "+result);
					//res.setHeader("Audio-Length", metaData.duration);
					res.send(result);
				});
			});
			
		});
	});
});

module.exports = router;

function sendToWebsocket(outputFile,callback){
	//let output_read = outputFile;
	let output_read = fs.createReadStream(outputFile);
	let data2=[];
	output_read.on('data', function(chunk) {
		data2.push(chunk);
	}).on('end', function() {
		output_read.close();
		var W3CWebSocket = require('websocket').w3cwebsocket;
		var client = new W3CWebSocket('wss://vr2.cyberon.com.tw/CyberonSTT/');
		let first = true;
		client.onmessage = function(e) {
			if (typeof e.data === 'string') {
				//console.log("Received: '" + e.data + "'");
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
					client.send(Buffer.concat(data2));
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
			//logger.log('WebSocket Client Connected');
		};
		
	});
}
function delete_file(file_name){
	fs.unlink(file_name, function(err) {
		if(err && err.code == 'ENOENT') {
			// file doens't exist
			console.info("File doesn't exist, won't remove it.");
		} else if (err) {
			// other errors, e.g. maybe we don't have enough permission
			console.error("Error occurred while trying to remove file");
		} else {
			//console.info(`removed`);
		}
	});
}


function callFfmpeg(m4a_stream,temp_file,callback){
	let g_metaData=null;
	ffmpeg(m4a_stream)
		//.inputFormat('mp4')
		.outputFormat('wav')
		.on('codecData',(metaData)=>{
			//logger.log("meta:");
			//logger.log(metaData);
			g_metaData = metaData;
		}).on('stderr',function(stderrLine){
			//console.log("stderr:");
			//console.log(stderrLine);
		}).on('error', (err,stdout,stderr) => {
			//console.log("ffmpeg stdout:\n" + stdout);
			//console.log("ffmpeg stderr:\n" + stderr);
			//console.log("ffmpeg stderr:\n" + err);
			//console.log('An error occurred: ' + err.message);
		}).on('progress', (progress) => {
			//logger.log(progress);	
			size=progress.targetSize;
			logger.log('Processing: ' + progress.targetSize + ' KB converted');
		}).on('end', () => {
			//logger.log('Processing finished !');
			if(callback){
				callback(g_metaData,temp_file)
			}
		}).save(temp_file);
		//.pipe(temp_file,{end:true});
}


function UUID(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}
/*
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
*/
