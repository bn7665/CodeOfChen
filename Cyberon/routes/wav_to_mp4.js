const http = require('https');
const querystring = require('querystring');
const express = require('express');
const fs = require('fs');
const router = express.Router();
const logger = /*require('./helper/logger') ||*/ console;

const ffmpeg = require('fluent-ffmpeg');
const toStream = require('buffer-to-stream')
//const audio_external_posi = "https://125.227.140.196/audio_convert/";
//const audio_internal_posi = "/var/www/html/audio_convert/";
const audio_external_posi = "https://ac282076.ngrok.io/audio_convert/";
const audio_internal_posi = "./public/audio_convert/";

router.get('/', function(req, res, next) {
	let name = UUID();
	let audio_internal_output = audio_internal_posi + name + ".m4a";
	let audio_external_output = audio_external_posi + name + ".m4a";
	
	let audio_url = new Buffer(req.query.audio_url, 'base64').toString('utf-8');
	wav_to_mp4( audio_url, audio_internal_output, function(ret){
		if(ret == "success"){
			logger.log("trans "+audio_url+" success.")
			res.send(audio_external_output);
		}else{
			res.send("failed");
		}
	});
	/*
	let b64_text= req.query.text || "";
	b64_text = req.query.text.length>2000?req.query.text.substring(b64_text.length-2000,b64_text.length):b64_text;
	let voice_text = req.query.text ? new Buffer(req.query.text, 'base64').toString('utf-8') : "?";
	console.log(req.query);
	let speaker = "DaiYu";
	if(req.query.voice=="male"){
		speaker="YouKan";
	}
	console.log(speaker);
	logger.log("voice_text: "+voice_text);
	let name = b64_text.replace(/\//g,'').substring(0,48);
	name = name +hashCode(name);
	let audio_internal_output = audio_internal_posi + name + "_" + speaker + ".m4a";
	let audio_external_output = audio_external_posi + name + "_" + speaker + ".m4a";
	if(fs.existsSync(audio_internal_output)){
		logger.log("audio_exists.")
		res.send(audio_external_output);
		return;
	}else{
		cyberon_tts_post( voice_text, audio_internal_output, function(ret){
			if(ret == "success"){
				logger.log("trans "+voice_text+" success.")
				res.send(audio_external_output);
			}else{
				res.send("failed");
			}
		},speaker);
	}*/
});

module.exports = router; 

function wav_to_mp4(audio_url,saved_file,callback){
	
	let options = require('url').parse(audio_url);
	options.method = 'GET';

	let get_req = http.request(options, function(resp) {
		let data = [];
		resp.on('data', function(chunk) {
			data.push(chunk);
		}).on('end', function() {
			const wav_stream = toStream(Buffer.concat(data));
			ffmpeg(wav_stream)
				.format('mp4')
				.on('error', (err,stdout,stderr) => {
					console.log('An error occurred: ' + err.message);
					callback("failed");
				}).on('progress', (progress) => {
					console.log('Processing: ' + progress.targetSize + ' KB converted');
				}).on('end', () => {
					console.log('Processing finished !');
					callback("success");
				})//.pipe(res,{end: true});
				.save(saved_file);
		});
	});
	
	//get_req.write(post_data);
	get_req.end();
}

function UUID(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}
