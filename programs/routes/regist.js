let express = require('express');
let router = express.Router();

let Tokens = require("csrf");
let tokens = new Tokens();

let Promise = require('promise');

require('../public/javascripts/myjs/myNodeModule.js');

/**
 * リクエストボディーからデータを抽出-----------------------------------------------------
 */
let getJsonData = function (req) {

	let json = {
		corpName: req.body.corpName,
		location: req.body.location,
		tel		: req.body.tel,
		msg		: req.body.msg,
		yymmdd	: req.body.yymmdd,
		info	: req.body.nm_info,
		csrf	: req.body._csrf,
		errors	: '',
	}

	return json;
};

/**
 *  リクエストデータを検証
 */
let validate = function (data) {
 
	let errors = data.errors = [];

	if (!data.corpName) {
		errors[errors.length] = "会社名を指定してください。";
	}

	if (!data.location) {
		errors[errors.length] = "所在地を指定してください。";
	}

	if (!data.tel) {
		errors[errors.length] = "電話番号を指定してください。";
	}
 
	if(!isNumber(data.tel)){
		errors[errors.length] = "電話番号は数字を入力してください。";
	}
  
	return errors.length === 0;
};

// POST: ---------- /regist/input ----------------------------------------------------
router.post("/input", function (req, res) {

	let json = getJsonData(req);

	console.log(getNowDate() + ' ======== regist_input json = ', JSON.stringify(json));

	// 新規に 秘密文字 と トークン を生成
	let secret	= tokens.secretSync();
	let token	= tokens.create(secret);
 
	// 秘密文字はセッションに保存
	req.session._csrf = secret;

	// トークンはクッキーに保存
	res.cookie("_csrf", token);

	// 入力データを取得
	let resJson = makeJson(json);

	// 入力画面の再表示views\shop\regist
	res.render("../views/regist/input.ejs", resJson);
});

//----------------------------------------------------------------------------------------------------
router.post("/confirm", function (req, res) {

	let json = getJsonData(req);

	console.log('==== confirm', JSON.stringify(json));

	let errors = validate(json);

	let resJson = makeJson(json);

	// 入力データの検証
	if (errors === false) {
		return res.render("../views/regist/input.ejs", resJson);
	}

	res.render("../views/regist/confirm.ejs", resJson);
});

/**
 * POST: /regist/complete ------------------------------------------------------------------
 */
router.post("/complete", function (req, res) {
	// 入力データを取得
	let json = getJsonData(req);

	// 秘密文字 と トークン を取得
	let secret	= req.session._csrf;
	let token	= req.cookies._csrf;

	// 秘密文字 と トークン の組み合わせが正しいか検証
	if (tokens.verify(secret, token) === false) {
		throw new Error("Invalid Token");
	}
	
	let p1 = postgreSQL_insert(json);

	Promise.all([p1]).then(() => {
		console.log("** 終了 ***");
		json.message = "";
		let resJson = makeJson(json);
		res.render("../views/regist/complete.ejs", resJson);
    }).catch(function (error) {
		console.error("失敗<><><><><><><><><> error:", error.message);
		json.message = "失敗";
		let resJson = makeJson(json);
		res.render("../views/regist/confirm.ejs", resJson);
	});
});

//----- /regist/complete2 ---（mongoDB）---------------------------------------------------------------
router.post("/complete2", function (req, res) {
	// 入力データを取得
	let json = getJsonData(req);

	// 秘密文字 と トークン を取得
	let secret = req.session._csrf;
	let token = req.cookies._csrf;

	// 秘密文字 と トークン の組み合わせが正しいか検証
	if (tokens.verify(secret, token) === false) {
		throw new Error("Invalid Token");
	}


	let json2 = {
		data: [
			{ 
				corpName: json.corpName,
				location: json.location,
				tel		: json.tel,
				yymmdd	: json.yymmdd,
			}
		]
	}

	let p1 = insert(json2);

	Promise.all([p1]).then(() => {

		console.log('111=====method_001M', JSON.stringify(json2));

		console.log("** 終了 ***");
		json.message = "";
		let resJson = makeJson(json);
		res.render("../views/regist/complete.ejs", resJson);
	}).catch(function (error) {

		console.log('222=====method_001M', JSON.stringify(json2));

		console.error("失敗<><><><><><><><><> error:", error.message);
		json.message = "失敗";
		let resJson = makeJson(json);
		res.render("../views/regist/confirm.ejs", resJson);
	});
});

/**
 * GET: /regist/complete -----------------------------------------------------------------
 */
router.get("/complete", function (req, res) {

	let json = {


    }

	let resJson = makeJson(json);
  
	res.render("../views/regist/complete.ejs", resJson);
});

/* POST home page. ***********************************************************************/
router.post('/', function(req, res, next) {

	let map01 = get_json_from_request(req);

	let w_clientMethodName	= map01.doClientMethod;

	let w_serverMethodName	= map01.doServerMethod;

	let executeName = w_serverMethodName + '(map01)';

	let stringified = eval(executeName);

	let hex_str = string_to_utf8_hex_string(stringified);

	res.json({
        textData	: hex_str ,
        methodName	: w_clientMethodName
    });
});

module.exports = router;
