var express = require('express');
var router = express.Router();
let fs = require("fs");

var Tokens = require("csrf");
var tokens = new Tokens();


require('../public/javascripts/myjs/myNodeModule.js');

/**
 * リクエストボディーからデータを抽出-----------------------------------------------------
 */
let makeSearchReqJson = function (req) {

	let json = {
		name: req.body.name,
		location: req.body.location,
		_csrf: req.body._csrf,
	}

	return json;
};

/* GET home page. ***** /main  ***************************************************************************/
router.get('/', function(req, res, next) {
	res.render("../views/main/input.ejs");
});

/* POST home page. **** /main  ****************************************************************************/
router.post('/', function(req, res, next) {
	res.render("../views/main/input.ejs");
});

/* GET home page. ***** /main/calc  ***************************************************************************/
router.post('/calc', function (req, res) {
	let reqJson = makeSearchReqJson(req);

	let resJson = makeJson(reqJson);

	res.render("../views/calc/input.ejs", resJson);
});

/**
 * POST: /main/searchStart (メイン画面から呼び出される)----------------------------------------
 */
router.post("/searchStart", function (req, res) {
	let reqJson = makeSearchReqJson(req);

	let resJson = makeJson(reqJson);

	// 入力画面の表示
	res.render("../views/search/index.ejs", resJson);
});

/**
 * POST: /main/workFlowStart (メイン画面から呼び出される)----------------------------------------
 */
router.post("/workFlowStart", function (req, res) {

	let businessJson = {
		j_file1: "./public/source/0001/gamen.txt",
		j_file2: "./public/source/0001/function.txt"
	};

	// テキストファイルを読んで、コンソール出力する
	let p1 = displayFile(businessJson);

	Promise.all([p1]).then(() => {


		// 入力データを取得
		let reqJson = makeSearchReqJson(req);

		let businessListJson = require('../public/source/business_lists.json');

		let hexSt = makeListHexSt(businessListJson.business);

		reqJson.j_businessList = hexSt;

		let gamenSt = makeGamen(businessJson);
		
		reqJson.j_buffSt = string_to_utf8_hex_string(gamenSt);

		reqJson.j_buffSt1 = string_to_utf8_hex_string(businessJson.j_buffSt1);
		reqJson.j_buffSt2 = string_to_utf8_hex_string(businessJson.j_buffSt2);
		reqJson.j_data = "みなみさわ";
		let resJson = makeJson(reqJson);

		// ワークフロー画面の表示
		res.render("../views/workFlow/businessList.ejs", resJson);
	}).catch(function (error) {
		console.error("失敗 error:", error.message);
	});
});

/**
 * POST: /main/start (メイン画面から呼び出される)----------------------------------------
 */
router.post("/start", function (req, res) {

	// 新規に 秘密文字 と トークン を生成
	let secret = tokens.secretSync();
	let token = tokens.create(secret);

	// 秘密文字はセッションに保存
	req.session._csrf = secret;

	// トークンはクッキーに保存
	res.cookie("_csrf", token);

	console.log('=!!!!= regist_input req.session._csrf=', req.session._csrf);

	let reqJson = {
		errors:[],
	}

	let resJson = makeJson(reqJson);

	res.render("../views/regist/input.ejs", resJson);
});

//-----------------------------------------------------------------------
router.post("/upload", function (req, res) {

	let reqJson = makeSearchReqJson(req);

	let resJson = makeJson(reqJson);

	// 入力画面の表示
	res.render("../views/upload/index.ejs", resJson);
});

/**
 * GET: /search/index  ------------------------------------------------------------------
 */
router.get("/index", function (req, res) {

	// 入力画面の表示
	search_index(req, res);
});

/**
 * POST: /main/index ------------------------------------------------------------------
 */
router.post("/index", function (req, res) {
	search_index(req, res);
});

//------------------------------------------------------------------------------------
function makeGamen(iJson) {

	let rtnString = iJson.buffSt1 + "<script>";

	let rootJson	= require('../public/source/0001/root.json');
	let json01		= require('../public/source/0001/json01.json');

	rtnString = rtnString + iJson.buffSt2;
	rtnString = rtnString + "root = " + JSON.stringify(rootJson) + ";";
	rtnString = rtnString + "json01 = " + JSON.stringify(json01) + ";";

	rtnString = rtnString + "</script>";

	return rtnString;
}

//------------------------------------------------------------------------------------
function makeListHexSt(array) {
	let rtnString = "";

	for (let i = 0; i < array.length; i++) {
		let json = array[i];
		rtnString = rtnString + "<div>" + json.name + "</div>";
	} 

	return string_to_utf8_hex_string(rtnString);
}

//指定ファイルを読込み入力JSONの要素に配備して返す-------------------------------------------
const displayFile = async (iJson) => {

	let buff1;
	let buff2;

	try {
		buff1 = await fs.readFileSync(iJson.j_file1, "utf-8");
		buff2 = await fs.readFileSync(iJson.j_file2, "utf-8");
	} catch (e) {
		console.log(e.message);
	} finally {
		iJson.j_buffSt1 = buff1.toString();
		iJson.j_buffSt2 = buff2.toString();
	}
};

module.exports = router;
