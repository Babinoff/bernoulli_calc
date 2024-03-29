var test_text = " \n test text: \n"  // TEST TEXT
//#region main
exports.input = function (data) {
	try {
		//#region params
		// let test = false;  // TEST TEXT
		let sprt = " "
		let body = JSON.parse(data.body);
		let json_answer = {'ok':'true'}
		if (body.hasOwnProperty('message') && body.message.hasOwnProperty('text'))
		{
			let b_text = body.message.text;
			let chat_id = body.message.chat.id;
			// //#endregion params
			test_text += "chat_id: \n " + chat_id // TEST TEXT
			let text_answer = "output: \n"
			let { list_of_str, i_atk, i_hit, i_wnd, i_arm, i_fnp, dice_to_hit, dice_to_wund, dice_armor_save, dice_fnp } = param_funct();
			if (b_text == "/roll"){
				text_answer = "Условия запуска: '/roll 6 5' - первая цифра это количество граней на кубике, вторая количество бросков кубика. \n"
				text_answer += "Пример запуска при этих параметрах: \n"
				text_answer = roll_funct2('/roll 6 5', list_of_str, text_answer, sprt)
			}
			if (b_text == "/poll"){
				text_answer = "Условия запуска: '/poll 5 3+ 4+ 5+ 6+' - первая цифра (в примере 5) это количество атак, вторая (3+) значение to hit, тертья (4+) to wound, четвертая (5+) armor save, пятая (6+) fnp \n"
				text_answer += "Пример запуска при этих параметрах: \n"
				text_answer = poll_funct('/poll 5 3+ 4+ 5+ 6+', sprt, list_of_str, i_atk, i_hit, i_wnd, i_arm, i_fnp, dice_to_hit, dice_to_wund, dice_armor_save, dice_fnp, text_answer)
			}

			if (b_text.includes("/roll") & b_text.includes(sprt)) {
				text_answer = roll_funct2(b_text, list_of_str, text_answer, sprt)
			}
			if (b_text.includes("/poll") & b_text.includes(sprt)){
				text_answer = poll_funct(b_text, sprt, list_of_str, i_atk, i_hit, i_wnd, i_arm, i_fnp, dice_to_hit, dice_to_wund, dice_armor_save, dice_fnp, text_answer)
			}

			if (b_text.includes("test")) {
				text_answer += "\n" + test_text  // TEST TEXT
			}
			json_answer = {
				"method": "sendMessage",
				"parse_mode": "Markdown",
				"chat_id": body.message.chat.id,
				"reply_to_message_id": body.message.message_id,
				"text": text_answer
			};
		}
		//#region json_answer
		return {
			"statusCode": 200,
			"headers": {
				'Content-Type': 'application/json'
			},
			"body": JSON.stringify(json_answer),
			"isBase64Encoded": false
		}
	}
	catch (e) {
		let text_answer = 'Ошибка ' + e.name + ":" + e.message + "\n" + e.stack
		let json_answer = {
			"method": "sendMessage",
			"chat_id": 236079948,
			// "reply_to_message_id": body.message.message_id,
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
	}
	// let json_answer = {
	// 	"method": "getMe",
	// 	// "chat_id": 236079948,
	// 	// // "reply_to_message_id": body.message.message_id,
	// 	// "text": "wtf"
	// };
	// 	return {
	// 	"statusCode": 200,
	// 	"headers": {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	"body": JSON.stringify(json_answer),
	// 	"isBase64Encoded": false
	// }
	//#endregion
}

//#endregion main

//#region comands functions
function param_funct() {
	let list_of_str = "";
	let dice_to_hit = { "1+": 1, "2+": 100 / 6 * 5 / 100, "3+": 100 / 6 * 4 / 100, "4+": 100 / 6 * 3 / 100, "5+": 100 / 6 * 2 / 100, "6+": 100 / 6 * 1 / 100 };
	let dice_to_wund = { "1+": 6, "2+": 5, "3+": 4, "4+": 3, "5+": 2, "6+": 1 };
	let dice_armor_save = { "No": null, "2+": 1, "3+": 2, "4+": 3, "5+": 4, "6+": 5 };
	let dice_fnp = { "No": null, "2+": 1, "3+": 2, "4+": 3, "5+": 4, "6+": 5 };
	let i_atk = 3;
	let i_hit = "4+";
	let i_wnd = "4+";
	let i_arm = "No";
	let i_fnp = "No";
	return { list_of_str, i_atk, i_hit, i_wnd, i_arm, i_fnp, dice_to_hit, dice_to_wund, dice_armor_save, dice_fnp };
}
function poll_funct(b_text, sprt, list_of_str, i_atk, i_hit, i_wnd, i_arm, i_fnp, dice_to_hit, dice_to_wund, dice_armor_save, dice_fnp, text_answer) {
	list_of_str = b_text.split(sprt);
	list_of_str.splice(0, 1) // Удаляем нудевой индекс с /roll
	i_atk = to_int(list_of_str[0]);
	if (i_atk <= 100){
		if (list_of_str != "" & b_text.indexOf('/roll') === -1) {
			test_text += "input: \n";
			test_text += "\n list_of_str content = " + list_of_str.join("\n"); // TEST TEXT
			// i_atk = to_int(list_of_str[0]);
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
	}
	else {
		text_answer += "\n Слишком большое значение атак, максимальное количество атак 100 \n" + b_text;
	}
	return text_answer;
}

function roll_funct2(b_text, list_of_str, text_answer, sprt) {
	list_of_str = b_text.split(sprt);
	if (list_of_str.length == 2 & b_text.split(sprt)[1] <= 100) {
		let dic_string_list = rand_dice2(b_text.split(sprt)[1]);
		text_answer += dict_to_string(dic_string_list);
	}
	else if (list_of_str.length > 2 & b_text.split(sprt)[1] <= 100 & b_text.split(sprt)[2] <= 100) {
		let dic_string_list = rand_dice2(b_text.split(sprt)[1], b_text.split(sprt)[2]);
		text_answer += dict_to_string(dic_string_list);
	}
	else{
		text_answer += "Слишком большие значения, максимальное количество граней кубика 100, максимальное количество бросков 100."
	}
	test_text += "list_of_str.length: " + list_of_str.length + "\n"; // TEST TEXT
	return text_answer;// return { list_of_str, text_answer };
}
//#endregion comands functions
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



function rand_dice2(max, count = "1"){
	let dice_list_result = []
	let dice_dic_results = {}
	let count_int = to_int(count)
	for (const k of Array(count_int).keys()){
		dice_list_result.push(Math.floor(Math.random() * max) + 1)
	}
	for (const dice of dice_list_result){
		dice_dic_results[dice] = []
	}
	for (const dice of dice_list_result){
		dice_dic_results[dice].push(dice)
	}
	return dice_dic_results;
}


function dict_to_string(dic_string_list){
	let string_list = []
	for (keys_and_items of Object.entries(dic_string_list)){
		string_list.push("```" + "_[" + keys_and_items.join("]=[") + "]_" + "```" + "*" + "общее количество: " + keys_and_items[1].length + "*")
	}
	let one_string = string_list.join("\n")
	return one_string;
}
//#endregion  core func
