
const settings = require('../configs.js');
const logger = require('../js/logger') || console;
//const logger = console;
var account = settings.cloudantDB.account;
var password = settings.cloudantDB.password;
var express = require('express');
//var fs = require('fs');
var router = express.Router();


var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant({account:account, password:password});

router.post('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	
	let table_name = req.body.table;
	let sql_query = req.body.sql_query;
	let raw_data = req.body.raw_data;
	let prev = req.body.prev;
	let cloudant_query = req.body.cloudant_query;
	
	let query_nosql = null;
	if(sql_query){
		query_nosql = table.explain(sql_query);
	}else{
		try {
			query_nosql = JSON.parse(cloudant_query);
		} catch (e) {
			console.log("cloudant_query_not_json_str");
			res.send("[]");
			return ;
		}
	}
	
	let normal_statistic = cloudant.db.use(table_name);
	let id_posi="";
	if(query_nosql["selector"]["type"] && query_nosql["selector"]["type"]["$eq"]=="SendMessages"){
		id_posi="sender";
	}else if(query_nosql["selector"]["type"] && query_nosql["selector"]["type"]["$eq"]=="LotteryPicture"){
		id_posi="sender";
	}else{
		id_posi="target";
	}
	
	logger.log("table_name",table_name);
	logger.log("query_nosql",query_nosql);
	let flatten_result = [];
	get_profile(prev,function(namedict){
		normal_statistic.find(query_nosql, function(err, result) {
			console.log(err);
			if (!err) {
				/*fs.writeFile("statistic.json", JSON.stringify(result), function(err) {
					if(err) {
						return console.log(err);
					}else{
						console.log("The file was saved!");
					}
				});*/ 
				
				
				logger.log("result.docs.length",result.docs.length);
				for (var i = 0; i < result.docs.length; i++) {
					item = result.docs[i];
					if(namedict[item[id_posi]]!=null){
						item.name = 
							namedict[item[id_posi]].last_name + 
							" " +
							namedict[item[id_posi]].first_name
					}
					
					item.time = new Date(new Date(item.timestamp).getTime()+8*3600*1000)
									.toISOString().replace("T"," ").split(".")[0];
				}
				
				let sn = query_nosql["skip"]?query_nosql["skip"]+1:1;
				
				//if(raw_data){
				//	flatten_result = result.docs;
				//}else 
				if(
					query_nosql["selector"] &&
					query_nosql["selector"]["type"] &&
					query_nosql["selector"]["type"]["$eq"] &&
					query_nosql["selector"]["type"]["$eq"]=="SendMessages" && !raw_data
				){
					flatten_result = flatten_SendMessages(sn,result.docs,query_nosql["selector"][id_posi]==null,prev,raw_data);
				}else if(
					query_nosql["selector"] &&
					query_nosql["selector"]["type"] &&
					query_nosql["selector"]["type"]["$eq"] &&
					query_nosql["selector"]["type"]["$eq"]=="AfterWatson" 
				){
					flatten_result = flatten_AfterWatson(sn,result.docs,query_nosql["selector"][id_posi]==null,prev);
				}else if(table_name=="normal_profile" || table_name=="music_profile"){
					flatten_result = flatten_UserProfile(sn,result.docs);
				}else if(raw_data){
					flatten_result=result.docs;
				}
				//console.log(JSON.stringify(result.docs));
				res.send(JSON.stringify(flatten_result));
					
			}else{
				throw err;
			}
					
		});
	});
	
});

module.exports = router;


function get_profile(prev,func){
	var table_name = (prev+"")=="true" ?"music_profile":"normal_profile";
	let normal_profile = cloudant.db.use(table_name);
	normal_profile.view('getUserName', 'getUserName', function(err, body) {
		if (!err) {
		let namedict = {};
		let namelist = body.rows.map(function(item){
			namedict[item.key[0]] = {
				id:item.key[0],
				last_name:item.key[1],
				first_name:item.key[2]
			}
			return item.key;
		});
		if(func){
			func(namedict);
		}
		}else{
			throw err;
		}
	});
}

function flatten_UserProfile(sn,ori_data){

	let exist_list = [];
	let dest_plain_table = [];
	for(let i=0;i<ori_data.length;i++){
		let item = ori_data[i];
		if(exist_list.indexOf(item.id)==-1){
			exist_list.push(item.id);
			dest_plain_table.push({
				"-": sn+i,
				"PSID": item.id,
				"姓": item.last_name,
				"名": item.first_name,
				"性別": item.gender,
				"大頭貼": "<a href='"+item.profile_pic+"' target='_blank'><img src='"+item.profile_pic+"' style='max-height:80px;max-width:80px;'></a>",
				"時間": item.time
			});
		}
	}
	return dest_plain_table;
}


function flatten_AfterWatson(sn,ori_data,id_url,prev){
	let dest_plain_table = [];
	for(let i=0;i<ori_data.length;i++){
		let item = ori_data[i];
		let intent = '';
		let entity = '';
		let psid = '';
		intent = item.watsonIntents[0]?("#"+item.watsonIntents[0].intent+"<br> ("+(item.watsonIntents[0].confidence+"").substring(0,5)+")"):"";
		entity = item.watsonEntities[0]?
		item.watsonEntities.map(function(e_item){return "@"+e_item.entity;}).join("<br>"):"";
		
		if(id_url){
			psid='<a target="_blank" href="./after_watson'+((prev+"")=="true"?'_prev':'')+'?id='+item.target+'">'+item.target+'</a>'
		}else{
			psid=item.target;
		}
		
		dest_plain_table.push({
			"-": sn+i,
			"PSID": psid,
			"名字": item.name,
			"說了": item.targetSays,
			"回應": item.watsonSays,
			"意圖": intent,
			"概念": entity,
			"時間": item.time
		});
	}
	return dest_plain_table;
}

function flatten_SendMessages(sn,ori_data,id_url,prev,raw_data){
	//let ori_data = JSON.parse(data);
	let dest_plain_table = [];
	for(let i=0;i<ori_data.length;i++){
		let item = ori_data[i];
		let psid = '';
		
		if(id_url){
			psid=(raw_data?'':'<a target="_blank" href="./send_messages'+((prev+"")=="true"?'_prev':'')+'?id='+item.sender+'">')+
					item.sender
					+(raw_data?'':'</a>')
		}else{
			psid=item.sender;
		}
		
		let msg_type = (
				item.targetSays && 
				item.targetSays[0] && 
				item.targetSays[0].message && 
				item.targetSays[0].message.attachments && 
				item.targetSays[0].message.attachments[0] && 
				item.targetSays[0].message.attachments[0].type
			) ? item.targetSays[0].message.attachments[0].type :"text";
		msg_type = msg_type=="image" && item.targetSays[0].message.attachments[0].payload && item.targetSays[0].message.attachments[0].payload.sticker_id ? "sticker" : msg_type;
			
		let msg_content = "UNKNOWN_TYPE";
		
		let message_text = (
				item.targetSays && 
				item.targetSays[0] && 
				item.targetSays[0].message && 
				item.targetSays[0].message.text
			) ? item.targetSays[0].message.text : "";
		
		let attachments_url = (
				item.targetSays && 
				item.targetSays[0] && 
				item.targetSays[0].message && 
				item.targetSays[0].message.attachments && 
				item.targetSays[0].message.attachments[0] && 
				item.targetSays[0].message.attachments[0].payload &&
				item.targetSays[0].message.attachments[0].payload.url 
			) ? item.targetSays[0].message.attachments[0].payload.url : "#";
			
		let fallback_url = (
				item.targetSays && 
				item.targetSays[0] && 
				item.targetSays[0].message && 
				item.targetSays[0].message.attachments && 
				item.targetSays[0].message.attachments[0] && 
				item.targetSays[0].message.attachments[0].url
			) ? item.targetSays[0].message.attachments[0].url : "#";
		
		let template_title = (
				item.targetSays && 
				item.targetSays[0] && 
				item.targetSays[0].message && 
				item.targetSays[0].message.attachments && 
				item.targetSays[0].message.attachments[0] && 
				item.targetSays[0].message.attachments[0].title 
			) ? item.targetSays[0].message.attachments[0].title : "#";
		
		msg_content = msg_type=="text" ? message_text : msg_content;
		msg_content = msg_type=="image" ? "<a href='"+attachments_url+"' target='_blank'>"
											//+"連結"
											+"<img src='"+attachments_url+"' style='max-height:80px;max-width:80px;'>"
											+"</a>" : msg_content;
		msg_content = msg_type=="sticker" ? "<a href='"+attachments_url+"' target='_blank'>"
											//+"連結"
											+"<img src='"+attachments_url+"' style='max-height:80px;max-width:80px;'>"
											+"</a>" : msg_content;
		msg_content = msg_type=="video" ? "&nbsp;<a href='"+attachments_url+"' target='_blank'>連結</a>" : msg_content;
		msg_content = msg_type=="audio" ? "&nbsp;<a href='"+attachments_url+"' target='_blank'>連結</a>" : msg_content;
		msg_content = msg_type=="fallback" ? message_text+"&nbsp;//&nbsp;<a href='"+fallback_url+"' target='_blank'>"+template_title+"</a>" : msg_content;
		msg_content = msg_type=="template" ? "title: "+template_title : msg_content;
		msg_content = msg_type=="file" ? "&nbsp;<a href='"+attachments_url+"' target='_blank'>連結</a>" : msg_content;
		
		var remind_manager = msg_type=="image"?{
			reply:true,
			reason:"圖片"
		}:able_to_reply(message_text);
		
		
		dest_plain_table.push({
			"-": sn+i,
			"PSID": psid,
			"名字": item.name,
			"訊息類型": msg_type,
			"訊息內容": msg_content,
			"訊息字數": message_text.length,
			"特殊情況": (remind_manager.reason?"O"+"&nbsp;("+remind_manager.reason+")":"X"),
			"回覆": (remind_manager.reply?"O <a target='_blank' href='./after_watson"+((prev+"")=="true"?"_prev":"")+"?id="+item.sender+"'>查看回覆</a>":"X"),
			"時間": item.time
		});
	}
	return dest_plain_table;
}

function able_to_reply(says){
    let reply = false;
    let reason = null;
    if(says.length>30){
        reason="ability:超過30字";
    }else if(says.indexOf("可以")!=-1&&says.indexOf("嗎")!=-1){
        reason="ability:可以...嗎?";
    }else if(says.indexOf("請問")!=-1&&says.indexOf("為什麼")!=-1){
        reason="ability:請問...為什麼";
    }else if(says.indexOf("為何")!=-1&&says.indexOf("會這樣?")!=-1){
        reason="ability:為何...會這樣";
    }else if(says.indexOf("怎麼處理")!=-1){
        reason="ability:怎麼處理";
    }else if(says.endsWith("了嗎?")){
        reason="ability:了嗎?";
    }else if(says.indexOf("請問一下")!=-1&&says.endsWith("?")){
        reason="ability:請問一下...?";
    }else if(says.indexOf("請問")!=-1&&says.indexOf("大概")!=-1){
        reason="ability:請問...大概...";
    }else if(says.indexOf("有沒有")!=-1&&says.endsWith("?")){
        reason="ability:有沒有...?";
    }else if(says.indexOf("請問")!=-1&&says.indexOf("呢?")!=-1){
        reason="ability:請問...呢?";
    }else if(says.indexOf("詢問一下")!=-1&&says.indexOf("真的嗎?")!=-1){
        reason="ability:詢問一下...真的嗎?";
    }else if(says.indexOf("希望")!=-1&&says.indexOf("真的")!=-1){
        reason="ability:希望...真的";
    }else if(says.indexOf("錯誤的")!=-1){
        reason="ability:錯誤的";
    }else if(says.indexOf("\n")!=-1){
        reason="ability:換行符號";
    }else if(says.endsWith("嗎?")){
        reply=true;
        reason="嗎?";
    }else if(says.indexOf("小編")!=-1){
        reply=true;
        reason="提及'小編'";
    }else if(says.indexOf("客服")!=-1){
        reply=true;
        reason="提及'客服'";
    }else if(says.indexOf("客訴")!=-1){
        reply=true;
        reason="提及'客訴'";
    }else if(says.indexOf("沒辦法")!=-1){
        reply=true;
        reason="提及'沒辦法'";
    }else if(says.indexOf("無法")!=-1){
        reply=true;
        reason="提及'無法'";
    }else{
        reply=true;
    }
    
    return {
        reply:reply,
        reason:reason
    };
}

