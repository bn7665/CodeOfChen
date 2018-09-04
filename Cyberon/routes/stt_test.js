

var express = require('express');
var router = express.Router();
const fs = require('fs');
const https = require('https');
const url = require('url');
const ffmpeg = require('fluent-ffmpeg');
const toStream = require('buffer-to-stream')

//var websocket = require('websocket-stream')
//var ws = websocket('wss://vr2.cyberon.com.tw/CyberonSTT/')
var stream = require('stream');
const Readable = require('stream').Readable;
const s = new Readable();
s._read = () => {}
//s.push('your text here');
//s.push(null);

//const toWav = require('audiobuffer-to-wav');
//const AudioContext = require('web-audio-api').AudioContext;
//const audioContext = new AudioContext;
let audio_url = "https://cdn.fbsbx.com/v/t59.3654-21/37139853_1875833759126503_6428417602216787968_n.mp4/audioclip-1531992425000-9427.mp4?_nc_cat=0&oh=8089389b45fd24ef7c08ac9ead196492&oe=5B52AA70";
let options  = require('url').parse(audio_url);

https.get(options, function(resp) {
	
	
	
	var data = [];
	resp.on('data', function(chunk) {
		data.push(chunk);
		s.push(chunk);
	}).on('end', function() {
		//const m4a_stream = toStream(Buffer.concat(data));
		var bufferStream = new stream.PassThrough();
		bufferStream.end(Buffer.concat(data));
		callFfmpeg(bufferStream,"tttemp.wav");
		//let streamhello=fs.createWriteStream("hello2.wavv");
		//m4a_stream.pipe(streamhello);
		//let streamhello3=fs.createWriteStream("hello3.wavv");
		//s.pipe(streamhello3)
	});
	
	/*let file1 = fs.createWriteStream("test1.wav");
	let file2 = fs.createWriteStream("test2.wav");
	resp.pipe(file1).on('finish', function () {
		let file0 = fs.createReadStream("test1.wav");
		file0.pipe(file2);
	});
	return ; */
	
	//#####################################
	/*
	ffmpeg(audio_url)
			.inputFormat('mp4')
			.on('codecData',(metaData)=>{
				console.log("meta:");
				console.log(metaData);
			}).on('stderr',function(stderrLine){
				console.log("stderr:");
				console.log(stderrLine);
			}).on('error', (err,stdout,stderr) => {
				console.log("ffmpeg stdout:\n" + stdout);
				console.log("ffmpeg stderr:\n" + stderr);
				console.log("ffmpeg stderr:\n" + err);
				console.log('An error occurred: ' + err.message);
			}).on('progress', (progress) => {
				console.log(progress);	
				size=progress.targetSize;
				console.log('Processing: ' + progress.targetSize + ' KB converted');
			}).on('end', () => {
				if(size==0)return ;
				console.log('Processing finished !');
				sendToWebsocket("helloa.wav");
			}).save("helloa.wav");
	*/
	//#######################################
	/*let i=0;
	var data = [];
	resp.on('data', function(chunk) {
		//if(i<1000){i++;return;}
		data.push(chunk);
		s.push(chunk);
	}).on('end', function() {
		const m4a_stream = toStream(Buffer.concat(data));
		//let streamhello=fs.createWriteStream("hello.wavv");
		//m4a_stream.pipe(streamhello);
		let temp_file = "/tmp/"+UUID()+".wav";
		ffmpeg(m4a_stream)
			.inputOptions('--hls-prefer-native')
			//.inputOptions('-flags +global_header')
			//.outputOptions(["-flags +global_header"])
			//.outputOptions(['-movflags isml'])
			.inputFormat('mp4')
			.on('codecData',(metaData)=>{
				console.log("meta:");
				console.log(metaData);
			}).on('stderr',function(stderrLine){
				console.log("stderr:");
				console.log(stderrLine);
			}).on('error', (err,stdout,stderr) => {
				console.log("ffmpeg stdout:\n" + stdout);
				console.log("ffmpeg stderr:\n" + stderr);
				console.log("ffmpeg stderr:\n" + err);
				console.log('An error occurred: ' + err.message);
			}).on('progress', (progress) => {
				console.log(progress);	
				size=progress.targetSize;
				console.log('Processing: ' + progress.targetSize + ' KB converted');
			}).on('end', () => {
				if(size==0)return ;
				console.log('Processing finished !');
				sendToWebsocket(temp_file);
			}).save(temp_file);
	});
	*/
	//##############################
	/*
	//console.log(resp);
	let temp_file = "/tmp/"+UUID()+".wav";
	let size = 0;
	ffmpeg(resp)
		.inputFormat('mp4')
		//.withAudioCodec('aac')
		//.format('mp3')
		.on('error', (err,stdout,stderr) => {
			console.log("ffmpeg stdout:\n" + stdout);
			console.log("ffmpeg stderr:\n" + stderr);
			console.log("ffmpeg stderr:\n" + err);
			console.log('An error occurred: ' + err.message);
		}).on('progress', (progress) => {
			console.log(progress);	
			size=progress.targetSize;
			console.log('Processing: ' + progress.targetSize + ' KB converted');
		}).on('end', () => {
			if(size==0)return ;
			console.log('Processing finished !');
			sendToWebsocket(temp_file);
		}).save(temp_file);
	*/
	//################################################
	/*var data = [];
	resp.on('data', function(chunk) {
		data.push(chunk);
	}).on('end', function() {
		const m4a_stream = toStream(Buffer.concat(data));
		let temp_file = "/tmp/"+UUID()+".wav";
		//ffmpeg(audio_url)
		ffmpeg(m4a_stream)
			//.inputFormat('mp4')
			//.withAudioCodec('aac')
			//.format('mp3')
			.on('error', (err,stdout,stderr) => {
				console.log("ffmpeg stdout:\n" + stdout);
				console.log("ffmpeg stderr:\n" + stderr);
				console.log("ffmpeg stderr:\n" + err);
				console.log('An error occurred: ' + err.message);
			}).on('progress', (progress) => {
				console.log('Processing: ' + progress.targetSize + ' KB converted');
			}).on('end', () => {
				console.log('Processing finished !');
				sendToWebsocket(temp_file);
			}).save(temp_file);
			//.pipe(res,{end: true});
		
	});*/
});

function callFfmpeg(m4a_stream,temp_file){
	ffmpeg(m4a_stream)
		//.inputFormat('mp4')
		.on('codecData',(metaData)=>{
			console.log("meta:");
			console.log(metaData);
		}).on('stderr',function(stderrLine){
			console.log("stderr:");
			console.log(stderrLine);
		}).on('error', (err,stdout,stderr) => {
			console.log("ffmpeg stdout:\n" + stdout);
			console.log("ffmpeg stderr:\n" + stderr);
			console.log("ffmpeg stderr:\n" + err);
			console.log('An error occurred: ' + err.message);
		}).on('progress', (progress) => {
			console.log(progress);	
			size=progress.targetSize;
			console.log('Processing: ' + progress.targetSize + ' KB converted');
		}).on('end', () => {
			if(size==0)return ;
			console.log('Processing finished !');
			sendToWebsocket(temp_file);
		}).save(temp_file);
}


function UUID(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}

function sendToWebsocket(temp_file){
	var W3CWebSocket = require('websocket').w3cwebsocket;
	var client = new W3CWebSocket('wss://vr2.cyberon.com.tw/CyberonSTT/');
	let first = true;
	client.onmessage = function(e) {
		if (typeof e.data === 'string') {
			console.log("Received: '" + e.data + "'");
			let receive_msg = JSON.parse(e.data);
			if(receive_msg.state=="listening"&& first){
				console.log('123');
				first =false;
				client.send(JSON.stringify({
					"action":"start",
					"domain":"freeSTT-zh-TW",
					"platform":"web",
					"uid":"g4ru04",
					"token":"VRIm8OIz9PnwuragczvYQos0Z4TKSShlmjEDzVfk-1Gok1fDmRpZSLviyCbEtpJZvEVYXw7kaULXawH0YqHqhI8D6Jviy-Gy7QQyIHUbke2FufamVh9gJcF8rZ1tqGlQ",
					"type":"audio/wav"
				}));
				fileReadStream = fs.createReadStream(temp_file);
				fileReadStream.on('data', function(chunk) {
					client.send(chunk);
				}).on('end', function() {
					client.send(JSON.stringify({"action" : "stop"}));
				});
				//client.send(wav);
				//client.send(JSON.stringify({"action" : "stop"}));
			}else if(receive_msg.state=="result"){
				//callback(receive_msg.recog_result);
				client.close();
			}else if(receive_msg.err_msg!=null){
				//callback(receive_msg.err_msg);
				client.close();
			}
			
		}
	};
	client.onopen = function() {
		console.log('WebSocket Client Connected');
	};
	
}

/*
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

var ws = websocket('wss://vr2.cyberon.com.tw/CyberonSTT/')
console.log('234');
ws.on('message', function () {

	console.log('123');
	ws.send(JSON.stringify({
		"action":"start",
		"domain":"freeSTT-zh-TW",
		"platform":"web",
		"uid":"g4ru04",
		"token":"VRIm8OIz9PnwuragczvYQos0Z4TKSShlmjEDzVfk-1Gok1fDmRpZSLviyCbEtpJZvEVYXw7kaULXawH0YqHqhI8D6Jviy-Gy7QQyIHUbke2FufamVh9gJcF8rZ1tqGlQ",
		"type":"audio/wav"
	}));
	ws.pipe(rs);
}).on('error', function (err) {
	console.log(err);
	console.log('456');
}).on('close', function (err) {
	console.log("Closing");
	console.log('345');
});

*/
