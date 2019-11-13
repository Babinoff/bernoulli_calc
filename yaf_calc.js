class dice_poll{
	constructor(atk=3, hit="", wnd="", arm="No", fnp="No") {
		this.atk = atk;
		this.hit = hit;
		this.wnd = wnd;
		this.arm = arm;
		this.fnp = fnp;
	}
}
function fc(n){
	if(n===0||n===1){
		return 1;
	}
	return n*fc(n-1);
}
function brn(p,k,n){
	return (fc(n)/(fc(k)*fc(n-k)))*(p**k*(1-p)**(n-k))
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
	if (list_of_str != "") {
		test_poll.atk = parseInt(list_of_str[0],10)
		if (list_of_str.length > 1){test_poll.hit = list_of_str[1]}
		if (list_of_str.length > 2){test_poll.wnd = list_of_str[2]}
		if (list_of_str.length > 3){test_poll.arm = list_of_str[3]}
		if (list_of_str.length > 4){test_poll.fnp = list_of_str[4]}
	}
	// let test_text = " chat_id:"+ch_id;
	test_text = "input: \n";
	if (list_of_str != "") {
		test_text += list_of_str.join("\n")
		test_text += "\n"
		test_text += "output:"
		// test_poll.dh = list_of_str[0];
		// test_poll.dw = list_of_str[1];
		test_text += "\n"
		test_text += dice_to_hit[test_poll.hit];
		test_text += "\n"
		test_text += dice_to_wund[test_poll.wnd];
	} else {test_text += b_text}
	
	for (const x of Array(test_poll.atk).keys()){
		test_text += "\n"
		test_text += x
	}

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