/*可用功能
1. TABLE th 排序
2. plain_table(obj)
	plain json => table ### 
3. query_view("normal_static","OOXX",callback)

4. warningMsg("警告", "發生錯誤")
5. loading() loading('over')
6. getUrlParameter("id")
7. hashCode("9f80e109-deb1-4d24-8569-31a50d05f679")
8. UUID()
*/
$(document).on('click','th',function(){
    var table = $(this).parents('table').eq(0);
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
    this.asc = !this.asc;
    if (!this.asc){rows = rows.reverse();}
    table.children('tbody').empty().html(rows);
});
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ?
            valA - valB : valA.localeCompare(valB);
    };
}
function getCellValue(row, index){
    return $(row).children('td').eq(index).text();
}

function plain_table(obj,name){
	var html ="";
	var data_name = name?name:"";
	if(Array.isArray(obj)){
		if(obj.length==0){
			
			warningMsg("警告",data_name+" 無資料");
		}else{
			let obj_keys = Object.keys(obj[0])
			html += "<table id='table' class='result-table'><thead><tr>";
			for(let i=0; i<obj_keys.length; i++) {
				html += '<th>' + obj_keys[i] + '</th>';
			}
			html += "</tr></thead><tbody>";
			
			for(let i=0; i<obj.length; i++) {
				html += "<tr>";
				for(let j=0; j<obj_keys.length; j++) {
					html += '<td>' + obj[i][obj_keys[j]] + '</td>';
				}
				html += "</tr>";
			}
			html += "</tbody></table>";
		}	
	}else{
		warningMsg("警告",data_name+" 錯誤");
	}
	return html;

}

function query_data(query_para,func){
	loading();
	$.ajax({
		type : "POST",
		url : "/query_data",
		cache : false,
		data : query_para,
		success: function(data) {
			loading('over');
			let jsonData = JSON.parse(data);
			if(func){
				func(jsonData);
			}
		}
		,error: function (jqXHR, textStatus, errorThrown) {
			loading('get error: '+jqXHR.responseText);
			warningMsg("錯誤","發生異常錯誤，請通知系統管理員。");
		}
	});
}

function query_view(query_para,callback){
	loading();
	$.ajax({
		type : "POST",
		url : "/query_view",
		cache : false,
		data : query_para,
		success: function(data) {
			if(callback){
				callback(data);
			}
			loading('over');
		}
		,error: function (jqXHR, textStatus, errorThrown) {
			loading('get error: '+jqXHR.responseText);
			warningMsg("錯誤","發生異常錯誤，請通知系統管理員。");
		}
	});
}

function warningMsg(title, msg) {
	$("<div/>").html(msg).dialog({
		title: title,
		draggable : true, resizable : false, autoOpen : true,
		height : "auto", width : "240", modal : true,
		buttons : [{
			text: "確定", 
			click: function() { 
				$(this).dialog("close");
			}
		}]
	});
}

function loading(str){
	if(!window.loading_count){
		loading_count=0;
	}
	if(!window.loading_timeout){
		loading_timeout=[];
	}
	
	if($("#loading").length==0){
		$("body").append('<div id="loading" style="display: none;padding:15px;"><div>資料讀取中，請稍後...</div></div>');
	}
	if(str!=null && str!="now"){
		if(str!="over"){
			console.log("loading_error:"+str);
		}
		loading_count--;
		
		clearTimeout(loading_timeout.shift());
		
		if(loading_count<=0){
			loading_count = 0;
			$("#loading").hide();
		}
	}else{
		loading_count++;
		if(str=="now"){
			$("#loading").show();
			loading_timeout.push (0);
		}else{
			loading_timeout.push ( 
				setTimeout(function(){
					$("#loading").show();
				},200)
			);
		}
	}
}

function getUrlParameter(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

function UUID(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}
