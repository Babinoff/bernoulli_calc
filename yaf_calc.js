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


function dice_drop(dice_to_hit=1, dice_to_wund=1, dice_armor_save=null, dice_fnp=null){
	let value_p = ""
	if (dice_armor_save == null & dice_fnp == null){
		value_p = dice_to_hit/6*dice_to_wund}
	else if(dice_armor_save & dice_fnp == null)
		{value_p = dice_to_hit/6*dice_to_wund/6*dice_armor_save}
	else if(dice_armor_save != null & dice_fnp != null)
		{value_p = dice_to_hit/6*dice_to_wund/6*dice_fnp}
	else if(dice_armor_save != null & dice_fnp != null)
		{value_p = dice_to_hit/6*dice_to_wund/6*dice_armor_save/6*dice_fnp}
	else { value_p = "how do you get whis? post me a later"}
	return value_p
}

function to_int(string){
	return parseInt(string,10)
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
	var test_text = "answer: \n"
	try {
		let dice_to_hit = {"1+":1,"2+":100/6*5/100,"3+":100/6*4/100,"4+":100/6*3/100,"5+":100/6*2/100,"6+":100/6*1/100};
		let dice_to_wund = {"1+":6,"2+":5,"3+":4,"4+":3,"5+":2,"6+":1};
		let dice_armor_save = {"No":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5};
		let dice_fnp = {"No":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5};

		// let test_poll = new dice_poll();
		test_text = "input: \n"
		if (list_of_str != "") {
			test_text += list_of_str.join("\n")
			// var atk = parseInt(list_of_str[0],10)
			test_text += "\n"
			test_text += "output:"
			test_text += "\n"
			var atk = to_int(list_of_str[0])
			if (list_of_str.length > 1){
				var hit = dice_to_hit[list_of_str[1]]
				// test_text += "\n"
				// test_text += hit
			}
			if (list_of_str.length > 2){
				var wnd = dice_to_wund[list_of_str[2]]
				// test_text += "\n"
				// test_text += wnd
			}
			if (list_of_str.length > 3){var arm = dice_armor_save[list_of_str[3]]
				// test_text += "\n"
				// test_text += arm
			}
			if (list_of_str.length > 4){var fnp = dice_fnp[list_of_str[4]]
				// test_text += "\n"
				// test_text += fnp
			}
		} else {test_text += b_text}
		// let test_text = " chat_id:"+ch_id;

		// if (list_of_str != "") {
		// 	test_text += list_of_str.join("\n")
		// 	test_text += "\n"
		// 	test_text += "output:"
		// 	// test_poll.dh = list_of_str[0];
		// 	// test_poll.dw = list_of_str[1];
		// 	test_text += "\n"
		// 	test_text += hit;
		// 	test_text += "\n"
		// 	test_text += wnd;
		// } else {test_text += b_text}
		//Ckn = n! / k!(n-k)!

		let brn_p = dice_drop(hit, wnd, arm, fnp)
		let ok_nums_list =[]
		let brnpsum = []
		// test_text += "\n"
		// test_text += brn_p
		let n = atk
		const reducer = (accumulator, currentValue) => accumulator + currentValue;
		for (const k of Array(atk+1).keys()){ //+1 нужно из за начала списка с 0
			// test_text += "\n"
			// test_text += k
			let brn_f = 100*brn(brn_p,k,n)
			brnpsum.push(brn_f)
			let itogo_int = to_int(Math.round(brnpsum.reduce(reducer)))
			let itogo_float = brnpsum.reduce(reducer)
			ok_nums_list.push([itogo_int, itogo_float])
		}
		let string_list = []
		for (const [i, num] of ok_nums_list.entries()) {
			if (i == 0){string_list.push(i+" wound s 0"+" to " +ok_nums_list[0][0])
			}
			else if (ok_nums_list[i-1][0] < 99){
				string_list.push(i+" wound s "+(ok_nums_list[i-1][0]+1)+" to " +num[0])
			}
			else{
				string_list.push(i+" wound s "+ok_nums_list[i-1][1]+" to " +num[1])
			}
		}
		test_text += string_list.join("\n")
	}
	catch (e) {test_text += 'Ошибка ' + e.name + ":" + e.message + "\n" + e.stack
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