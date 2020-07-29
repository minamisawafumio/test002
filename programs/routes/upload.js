var express = require('express');

var multer = require('multer');

var router = express.Router();

require('../public/javascripts/myjs/myNodeModule.js');

/**
 * リクエストボディーからデータを抽出-----------------------------------------------------
 */
var getJsonData = function (req) {

	let json2 = {
		 name: req.body.name,
	 location: req.body.location,
	 	  tel: req.body.tel,
	 	  msg: '',
	   result: '',
	    count: 0,
		 csrf: req.body._csrf,
	   errors:''
	}

	return json2;
};

/**
 * GET: /search/index  ------------------------------------------------------------------
 */
router.get("/index", function (req, res) {

	// 入力画面の表示
	search_index(req, res);
});

/**
 * POST: /search/index ------------------------------------------------------------------
 */
router.post("/index", function (req, res) {
	search_index(req, res);
});

//----------------------------------------------------------------------------------------
function search_index(req, res) {
	// 入力データを取得
	let jsonDataReceive = getJsonData(req);

	let jsonDataSend = makeJson(jsonDataReceive);

	// 入力画面の表示
	res.render("../views/upload/index.ejs", jsonDataSend);
}


/**
 * POST: /upload/upload01 ------------------------------------------------------------------
 */
router.post("/upload01", function (req, res) {
//app.post('/upload01', upload.single('avatar'), function (req, res, next) {

		console.log('>>>>>>>>upload01', 'aaaaaaaaaaaaaaaaaaaa');
		console.log('>>>>>>>>upload01 req.file=', req.file);

		//res.send("uploaded" + req.file.destination);

});

module.exports = router;
