exports.input = function (data){
	let body = JSON.parse(data.body);
	let b_text = body.message.text;
	let ch_id = body.message.chat.id;
	let dice_to_hit = {"1+":1,"2+":100/6*5/100,"3+":100/6*4/100,"4+":100/6*3/100,"5+":100/6*2/100,"6+":100/6*1/100};
	let dice_to_wund = {"1+":6,"2+":5,"3+":4,"4+":3,"5+":2,"6+":1};
	let dice_armor_save = {"No":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5};
	let dice_fnp = {"No":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5};
	let all_text = " chat_id:"+ch_id;
	all_text += " dice_to_hit:"+dice_to_hit["5+"]
	let answer = {
			"method":"sendMessage",
			"chat_id": body.message.chat.id, 
			"reply_to_message_id" : body.message.message_id, 
			"text" : all_text//"Текст сообщения: "+b_text+" chat_id:"+ch_id+" dice_to_hit:"+dice_to_hit["5+"]+"dice_to_wund="+dice_to_wund["5+"]+"dice_armor_save"+dice_armor_save["No"]
	};

	return {
		"statusCode": 200,
		"headers": {
			'Content-Type': 'application/json'
		},
		"body": JSON.stringify(answer),
		"isBase64Encoded": false
	}
}