class dice_poll{
	constructor(dh="",dw="",da="No",df="No",ac=3) {
		this.dh = dh;
		this.dw = dw;
		this.da = da;
		this.df = df;
		this.ac = ac;
	}
}
exports.input = function (data){
	let sprt = "||"
	let body = JSON.parse(data.body);
	let b_text = body.message.text;
	let ch_id = body.message.chat.id;
	let list_of_str = "";
	if (b_text.includes(sprt)) {
		list_of_str = b_text.split(sprt);
	}

	let dice_to_hit = {"1+":1,"2+":100/6*5/100,"3+":100/6*4/100,"4+":100/6*3/100,"5+":100/6*2/100,"6+":100/6*1/100};
	let dice_to_wund = {"1+":6,"2+":5,"3+":4,"4+":3,"5+":2,"6+":1};
	let dice_armor_save = {"No":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5};
	let dice_fnp = {"No":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5};

	let test_poll = new dice_poll();
	// let test_text = " chat_id:"+ch_id;
	test_text = "input: \n";
	test_text += list_of_str.join("\n")
	if (list_of_str != "") {
		test_text += "\n"
		test_text += "output:"
		// test_poll.dh = list_of_str[0];
		// test_poll.dw = list_of_str[1];
		test_text += "\n"
		test_text += dice_to_hit[list_of_str[0]];
		test_text += "\n"
		test_text += dice_to_wund[list_of_str[1]];
	};
	

	let answer = {
			"method":"sendMessage",
			"chat_id": body.message.chat.id, 
			"reply_to_message_id" : body.message.message_id, 
			"text" : test_text
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