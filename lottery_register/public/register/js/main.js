
(function ($) {
    "use strict";
	$('#no-script').remove();
	$('form').show();
    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

		 if(!$("#agree").prop("checked")) {
			$("#agree").parent().css("border","1px solid #f00");
			$("#agree").parent().css("background-color","#fdd");
			check = false;
		}else{
			$("#agree").parent().css("border","0px solid #f00");
			$("#agree").parent().css("background-color","transparent");
		}
		
		if(check){
			setTimeout(function(){
				$.ajax({
					type : "POST",
					url : "/ht_trace_log",
					cache : false,
					data : {
						cookie_id : actCookieId,
						canvas_fingerprint : canvas.getCanvasFingerprint(),
						event_id: "ytff",
						phone_number: $("input[name='telphone']").val().replace(/-()/g,""),
						email:$("input[name='email']").val(),
						custom_information:{
							"name":$("input[name='username']").val()
						},
						date_time : Date.now()
					},
					success: function(result) {
						console.log("logButton");
						console.log(result);
					}
				});
				$.ajax({
					type : "POST",
					url : "registry_data",
					cache : false,
					data : {
						username : $("input[name='username']").val(),
						telphone : $("input[name='telphone']").val().replace(/-()/g,""),
						email : $("input[name='email']").val(),
						time : new Date(Date.now()+8*3600*1000).toISOString().replace("T"," ").split(".")[0],
						timestamp : Date.now()
					},
					success: function(result) {
						console.log(result);
						let height = $("form").height();
						if(result=="success"){
							$("form").html("<div style='text-align:center;height:"+height+"px'>"
							+"<h3>◤完成抽獎資料填寫◢</h3><br>"
							+"<h4>小編幫你祈禱~祝你中獎</h4><br>"
							//+"<a href='https://www.youtubefanfest.com/event/2018-tw'><h2>活動連結</h2></a>"
							+"</div>");
							setTimeout(function(){
								window.location.href = "https://www.youtubefanfest.com/event/2018-tw";
							},2000);
							
						/*}else if(result=="duplicate username"){
							$("form").html("<div style='text-align:center;height:"+height+"px'>"
								+"<h3>您的姓名已經登記過囉</h3><br>"
								+"<h4>請勿重複登記</h4><br>"
								+"<a href='/'><h4>我想幫我家人登記</h4></a>"
								+"</div>");*/
						}else if(result=="duplicate telphone"){
							$("form").html("<div style='text-align:center;height:"+height+"px'>"
								+"<h3>該電話已經被登記過囉</h3><br>"
								//+"<h4>請勿重複登記</h4><br>"
								+"<a href='/'><h4>重新填寫</h4></a>"
								+"</div>");
						}else if(result=="duplicate email"){
							$("form").html("<div style='text-align:center;height:"+height+"px'>"
								+"<h3>該信箱已經被登記過囉</h3><br>"
								//+"<h4>請勿重複登記</h4><br>"
								+"<a href='/'><h4>重新填寫</h4></a>"
								+"</div>");
						}else{
							$("form").html("<div style='text-align:center;height:"+height+"px'><h3>登記異常<br>請聯繫活動聯絡人</h3></div>");
						}
					},error: function (jqXHR, textStatus, errorThrown) {
						let height = $("form").height();
						$("form").html("<div style='text-align:center;height:"+height+"px'><h3>登記異常<br>請稍後再試或聯繫活動聯絡人</h3></div>");
					}
				});
			},100);
		}
		
        return false;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'username' || $(input).attr('name') == 'username') {
            if($(input).val().trim().search(/^[\u4e00-\u9fa5\x3130-\x318F\u0800-\u4e00_a-zA-Z`∙•・●]+$/) == -1 || $(input).val().length<2) {
                return false;
            }
        }
		if($(input).attr('type') == 'telphone' || $(input).attr('name') == 'telphone') {
            if($(input).val().trim().search(/^[\+0-9\-()]{6,18}$/) == -1) {
                return false;
            }
        }
		if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().search(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == -1) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);