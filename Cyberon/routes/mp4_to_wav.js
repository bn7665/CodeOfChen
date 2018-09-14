
var express = require('express');
var router = express.Router();
const fs = require('fs');
const https = require('https');
const url = require('url');
const logger = console;
const stream = require('stream');
const ffmpeg = require('fluent-ffmpeg');

const audio_external_posi = "https://ac282076.ngrok.io/audio_convert/";
const audio_internal_posi = "./public/audio_convert/";

router.get('/', function(req, res, next) {
	let audio_url = req.query.audio_url?Buffer.from(req.query.audio_url, 'base64').toString():"";
	console.log(audio_url);
	let name = UUID();
	let audio_internal_output = audio_internal_posi + name + ".wav";
	let audio_external_output = audio_external_posi + name + ".wav";
	
	let options  = require('url').parse(audio_url);

	https.get(options, function(resp) {
		let temp_file = "/tmp/"+UUID()+".mp4";
		let streamhello=fs.createWriteStream(temp_file);
		resp.pipe(streamhello).on('finish', function () {
			let outputFile = "./public/audio_convert/"+UUID()+".wav";
			mp4_to_wav(temp_file,audio_internal_output,function(result){
				delete_file(temp_file);
				if(result=="success"){
					res.send(audio_external_output);
				}else{
					res.send(result);
				}
			});
			
		});
	});
});

module.exports = router;

function delete_file(file_name){
	fs.unlink(file_name, function(err) {
		if(err && err.code == 'ENOENT') {
			console.info("File doesn't exist, won't remove it.");
		} else if (err) {
			console.error("Error occurred while trying to remove file");
		} else {
			//console.info(`removed`);
		}
	});
}


function mp4_to_wav(m4a_stream,temp_file,callback){
	let g_metaData=null;
	ffmpeg(m4a_stream)
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
			console.log('An error occurred: ' + err.message);
			if(callback){
				callback(err.message)
			}
		}).on('progress', (progress) => {
			size=progress.targetSize;
			logger.log('Processing: ' + progress.targetSize + ' KB converted');
		}).on('end', () => {
			//logger.log('Processing finished !');
			if(callback){
				callback("success")
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
