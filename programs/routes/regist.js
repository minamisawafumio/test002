let express = require('express');
let router = express.Router();

let Tokens = require("csrf");
let tokens = new Tokens();

let Promise = require('promise');

require('../public/javascripts/myjs/myNodeModule.js');
//--- postgreSQL接続 --------------------------------------
const { getPostgresClient } = require('../public/javascripts/myjs/postgres.js');

//--- mongodb 設定 --------------------------------------
let co = require('co');
let assert = require('assert');

const MongoClient = require('mongodb').MongoClient;

// 接続先URL
const url = 'mongodb://localhost:27017';

// データベース名
const dbName = 'db0003';

//MongoClient用オプション設定
const connectOption = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

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

	let p1 = mongo_insert(json2);

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

//データ登録（postgreSQL）----------------------------------------------------------------------------------------
async function postgreSQL_insert(iJson) {

	let w_hex = json_to_utf8_hex_string(iJson);

	const db = await getPostgresClient();

	try {
		const sql = "INSERT INTO t_0000 (key1, key2, key3, value) VALUES ('nodeJs', '1','" + iJson.corpName + "','" + w_hex + "')";

		console.log('** postgreSQL_insert sql=', sql);

		await db.begin();

		await db.execute(sql);
		await db.commit();
	} catch (e) {
		await db.rollback();
		throw new Error('ERROR!!!');
	} finally {
		await db.release();
	}
}

//----------------------------------------------------------------------------------------
async function mongo_insert(json) {

	let client = await MongoClient.connect(url, { useNewUrlParser: true })
		.catch(err => { console.log(err); });

	try {
		/** DBを取得 */
		let db = client.db(dbName);

		let collection = db.collection('documents');

		let result = await collection.insertMany(json.data);

		json.result = result;

	} catch (err) {
		console.log(err);
	} finally {
		client.close();
	}
}

module.exports = router;
