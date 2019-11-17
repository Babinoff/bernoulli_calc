var test_text = " \n test text: \n"  // TEST TEXT


//#region core func
function fc(n) {
	if (n === 0 || n === 1) {
		return 1;
	}
	return n * fc(n - 1);
}


function brn(p, k, n) {
	return (fc(n) / (fc(k) * fc(n - k))) * (p ** k * (1 - p) ** (n - k))
}


function dice_drop(dice_to_hit, dice_to_wund, dice_armor_save, dice_fnp) {
	let value_p = ""
	if (dice_armor_save == null & dice_fnp == null) {
		value_p = dice_to_hit / 6 * dice_to_wund
	}
	else if (dice_armor_save != null & dice_fnp == null) { value_p = dice_to_hit / 6 * dice_to_wund / 6 * dice_armor_save }
	else if (dice_armor_save == null & dice_fnp != null) { value_p = dice_to_hit / 6 * dice_to_wund / 6 * dice_fnp }
	else if (dice_armor_save != null & dice_fnp != null) { value_p = dice_to_hit / 6 * dice_to_wund / 6 * dice_armor_save / 6 * dice_fnp }
	else { value_p = "how do you get whis? post me a later" }
	return value_p
}


function to_int(string) {
	return parseInt(string, 10)
}


function rand_dice(max, count = "1"){
	let dice_results = []
	let count_int = to_int(count)
	for (const k of Array(count_int).keys()){
		let random_value = Math.floor(Math.random() * max) + 1
		test_text += random_value
		dice_results.push(random_value)
	}
	return dice_results;
}
//#endregion  core func


//#region main
exports.input = function (data) {
	//#region params
	var test = false;  // TEST TEXT
	let sprt = " "
	let body = JSON.parse(data.body);
	let b_text = body.message.text;
	let chat_id = body.message.chat.id;
	//#endregion params
	test_text += "chat_id: \n " + chat_id // TEST TEXT
	var text_answer = "output: \n"
	try {
		let list_of_str = "";
		let dice_to_hit = { "1+": 1, "2+": 100 / 6 * 5 / 100, "3+": 100 / 6 * 4 / 100, "4+": 100 / 6 * 3 / 100, "5+": 100 / 6 * 2 / 100, "6+": 100 / 6 * 1 / 100 };
		let dice_to_wund = { "1+": 6, "2+": 5, "3+": 4, "4+": 3, "5+": 2, "6+": 1 };
		let dice_armor_save = { "No": null, "2+": 1, "3+": 2, "4+": 3, "5+": 4, "6+": 5 };
		let dice_fnp = { "No": null, "2+": 1, "3+": 2, "4+": 3, "5+": 4, "6+": 5 };
		let i_atk = 3
		let i_hit = "4+"
		let i_wnd = "4+"
		let i_arm = "No"
		let i_fnp = "No"

		if (b_text.includes("/roll") & b_text.includes(sprt)) {
			text_answer = roll_funct(b_text, list_of_str, text_answer, sprt)
		}
		if (b_text.includes("/poll") & b_text.includes(sprt)){
			text_answer = poll_funct(b_text, sprt, list_of_str, i_atk, i_hit, i_wnd, i_arm, i_fnp, dice_to_hit, dice_to_wund, dice_armor_save, dice_fnp, text_answer)
		}


		if (test) {
			text_answer += "\n" + test_text  // TEST TEXT
		}
		if (b_text.includes("test")) {
			text_answer += "\n" + test_text  // TEST TEXT
		}
	}
	catch (e) {
		var text_answer = 'Ошибка ' + e.name + ":" + e.message + "\n" + e.stack
	}

	//#region json_answer
	let json_answer = {
		"method": "sendMessage",
		"chat_id": body.message.chat.id,
		"reply_to_message_id": body.message.message_id,
		"text": text_answer
	};

	return {
		"statusCode": 200,
		"headers": {
			'Content-Type': 'application/json'
		},
		"body": JSON.stringify(json_answer),
		"isBase64Encoded": false
	}
	//#endregion
}

function poll_funct(b_text, sprt, list_of_str, i_atk, i_hit, i_wnd, i_arm, i_fnp, dice_to_hit, dice_to_wund, dice_armor_save, dice_fnp, text_answer) {
	list_of_str = b_text.split(sprt);
	if (list_of_str != "" & b_text.indexOf('/roll') === -1) {
		test_text += "input: \n";
		test_text += "\n list_of_str content = " + list_of_str.join("\n"); // TEST TEXT
		list_of_str.splice(0, 1) // Удаляем нудевой индекс с /roll
		i_atk = to_int(list_of_str[0]);
		test_text += "\n list_of_str.length = " + list_of_str.length; // TEST TEXT
		if (list_of_str.length > 1) {
			i_hit = list_of_str[1];
		}
		else { }
		if (list_of_str.length > 2) {
			i_wnd = list_of_str[2];
		}
		if (list_of_str.length > 3) {
			i_arm = list_of_str[3];
		}
		if (list_of_str.length > 4) {
			i_fnp = list_of_str[4];
		}
		let atk = i_atk;
		let hit = dice_to_hit[i_hit];
		let wnd = dice_to_wund[i_wnd];
		let arm = dice_armor_save[i_arm];
		let fnp = dice_fnp[i_fnp];
		let brn_p = dice_drop(hit, wnd, arm, fnp);
		test_text += "\n brn_p = " + brn_p; // TEST TEXT
		let ok_nums_list = [];
		let brnpsum = [];
		let n = atk;
		const reducer = (accumulator, currentValue) => accumulator + currentValue;
		for (const k of Array(atk + 1).keys()) { //+1 нужно из за начала списка с 0
			let brn_f = 100 * brn(brn_p, k, n);
			brnpsum.push(brn_f);
			let itogo_int = to_int(Math.round(brnpsum.reduce(reducer)));
			test_text += "\n itogo_int = " + itogo_int; // TEST TEXT
			let itogo_float = brnpsum.reduce(reducer);
			test_text += "\n itogo_float = " + itogo_float; // TEST TEXT 
			ok_nums_list.push([itogo_int, itogo_float]);
		}
		let string_list = [];
		for (const [i, num] of ok_nums_list.entries()) {
			if (i == 0) {
				string_list.push(i + " wound s 0" + " to " + ok_nums_list[0][0]);
			}
			else if (ok_nums_list[i - 1][0] < 99) {
				string_list.push(i + " wound s " + (ok_nums_list[i - 1][0] + 1) + " to " + num[0]);
			}
			else {
				string_list.push(i + " wound s " + ok_nums_list[i - 1][1] + " to " + num[1]);
			}
		}
		text_answer += string_list.join("\n");
	}
	else {
		text_answer += "\n input: \n" + b_text;
	}
	return text_answer;
}

function roll_funct(b_text, list_of_str, text_answer, sprt) {
	list_of_str = b_text.split(sprt);
	if (list_of_str.length == 2) {
		let string_list = rand_dice(b_text.split(sprt)[1]);
		text_answer += string_list.join("\n");
	}
	else if (list_of_str.length > 2) {
		let string_list = rand_dice(b_text.split(sprt)[1], b_text.split(sprt)[2]);
		text_answer += string_list.join("\n");
	}
	test_text += "list_of_str.length: " + list_of_str.length + "\n"; // TEST TEXT
	return text_answer;// return { list_of_str, text_answer };
}
//#endregion main