let express = require('express');

const PDFDocument = require('pdfkit');

let router = express.Router();

let Promise = require('promise');

require('../public/javascripts/myjs/myNodeModule.js');
require('../public/javascripts/myjs/mongoDbModule.js');
require('../public/javascripts/myjs/postgreSqlModule.js');

//MongoClient用オプション設定
const connectOption = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

/**
 * POST: /search/result-list ---------------------------------------------------------------
 */
router.post("/result-list", function (req, res) {
	// 入力データを取得
	let reqJson = get_json_from_request(req);

	let rersJson = makeJson(reqJson);

	res.render("../views/search/result-list.ejs", rersJson);
});

/**
 * POST: /search/pdf01 ------------------------------------------------------------------
 */
router.post("/pdf01", function (req, res) {
	do_pdf01(req, res);
});

/* POST home page. **** /search/execute  *******************************************************************/
router.post('/execute01', function (req, res) {
	let executeName = evalExecute(req, res);
	eval(executeName);
});

//------------------------------------------------------------------------------------------
function method_001(req, res) {

	let reqJson = get_json_from_request(req);

	console.log(getNowDate() + ' ======== method_001', JSON.stringify(reqJson));

	let p1 = corp_search(reqJson);

	Promise.all([p1]).then(() => {

		let hexSt = reqJson.result[0].value;

		let json2 = utf8_hex_string_to_json(hexSt);

		let json3 = {
			methodName: reqJson.methodName,
			corpName: json2.corpName,
			location: json2.location,
			tel		: json2.tel,
			yymmdd	: json2.yymmdd,
			msg		: '検索件数は、' + reqJson.count + ' 件です',
        }

		let resJson = makeJson(json3);
		res.json(resJson);
	}).catch(function (error) {
		console.error("失敗<><><><><><><><><> error:", error.message);
		reqJson.out_message = '検索取得に失敗しました';
		let json = makeJson(reqJson);
		res.json(json);
	});
}

//------------------------------------------------------------------------------------------
function method_001M(req, res) {
	console.log(getNowDate() + ' ======== method_001M', '==================');

	let json = get_json_from_request(req);

	let keyJson = {
		corpName: json.corpName
	}

	let p1 = searchM(keyJson);

	Promise.all([p1]).then(() => {
		json.tel			= keyJson.result.tel;
		json.location		= keyJson.result.location;
		json.yymmdd			= keyJson.result.yymmdd;
		json.out_message	 = '検索できました';
		console.log('++method_001M json=', JSON.stringify(keyJson));
		let resJson = makeJson(json);
		res.json(resJson);
	}).catch(function (error) {
		console.error("失敗<><><><><><><><><> error:", error.message);
		json.out_message = '該当データはありません';
		let resJson = makeJson(json);
		res.json(resJson);
	});
}

//------------------------------------------------------------------------------------------
function method_updateM(req, res) {
	console.log(getNowDate() + ' ======== method_updateM', '==================');

	let json = get_json_from_request(req);

	//入力チェック
	let result = method_updateM_validate(json);

	//入力チェックでエラーがある場合はメッセージを返却する
	if (result != "") {
		json.out_message = result;
		return res.json(makeJson(json));
    }

	let keyJson = { corpName: json.corpName }

	let valueJson = {
		$set: {
			location: json.location,
			tel		: json.tel,
			yymmdd	: json.yymmdd,
		}
	}

	let upsertJson = {
		upsert: true
    }

	let p1 = updateM2(keyJson, valueJson, upsertJson);

	Promise.all([p1]).then(() => {
		json.out_message = '更新しました';
		let resJson = makeJson(json);
		res.json(resJson);
	}).catch(function (error) {
		console.error("失敗<><><><><><><><><> error:", error.message);
		reqJson.out_message = '検索取得に失敗しました';
		let json = makeJson(reqJson);
		res.json(json);
	});
}

//-----------------------------------------------------
function method_updateM_validate(json) {
	let rtnSt = "";

	let RCODE = String.fromCharCode(13);
	let LFCODE = String.fromCharCode(10);

	if (json.location == "") {
		rtnSt = '場所を入力してください' + RCODE + LFCODE;
    }
	if (json.tel == "") {
		rtnSt = rtnSt + '電話番号を入力してください' + RCODE + LFCODE;
	}
	if (json.yymmdd == "") {
		rtnSt = rtnSt + '生年月日を入力してください' + RCODE + LFCODE;
	}
	return rtnSt;
}

//------------------------------------------------------------------------------------------
function method_deleteM(req, res) {
	console.log(getNowDate() + ' ======== method_deleteM', '==================');

	let reqJson = get_json_from_request(req);

	let keyJson = { "corpName": reqJson.corpName }

	let p1 = deleteM(keyJson);

	Promise.all([p1]).then(() => {

		let json = {
			methodName: reqJson.methodName,
			corpName: keyJson.corpName,
			location	: '',
			tel			: '',
			yymmdd		: '',
			msg			: '削除しました',
		}

		let resJson = makeJson(json);
		res.json(resJson);
	}).catch(function (error) {
		console.error("失敗<><><><><><><><><> error:", error.message);
		reqJson.out_message = '検索取得に失敗しました';
		let json = makeJson(reqJson);
		res.json(json);
	});
}

//--------------------------------------------------------------------------------------
function method_002(req, res) {
	console.log(getNowDate() + ' ======== method_002', '==================');

	let reqJson = get_json_from_request(req);

	let p1 = video_search(reqJson);

	Promise.all([p1]).then(() => {
		resJson.count = '検索件数は、' + String(resJson.count) + ' 件です２';
		let json = makeJson(reqJson);
		res.json(json);
	}).catch(function (error) {
		resJson.count = '失敗です';
		let json = makeJson(reqJson);
		res.json(json);
	});
}

//--------------------------------------------------------------------------------------
function search_init(req, res) {

	console.log(getNowDate() + ' ======== search_init', '==================');

	let reqJson = get_json_from_request(req);

	let p1 = corp_search(reqJson);

	Promise.all([p1]).then(() => {

		let json01 = getBussinessJson('business_0001.json');

		//let hexSt01 = json_to_utf8_hex_string(json01);

		reqJson.business_info = JSON.stringify(json01); //hexSt01;

		let json = makeJson(reqJson);
		res.json(json);
	}).catch(function (error) {
		console.error("失敗<><><><><><><><><> error:", error.message);
		reqJson.out_message = '検索取得に失敗しました';
		let json = makeJson(reqJson);
		res.json(json);
	});
}

function do_pdf01(req, res) {

	let doc = new PDFDocument();
	let filename = 'abcdefg';

	filename = encodeURIComponent(filename) + '.pdf';

	res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
	res.setHeader('Content-type', 'application/pdf');
	const content = req.body.content;
	doc.y = 300;
	doc.text(content, 50, 50);

	// Embed a font, set the font size, and render some text
	doc.font('public/fonts/ipaexg.ttf')
		.fontSize(25)
		.text('Some text with an embedded font!', 100, 100);

	// Add an image, constrain it to a given size, and center it vertically and horizontally
	doc.image('public/images/image.png', {
		fit: [250, 300],
		align: 'center',
		valign: 'center'
	});

	// Add another page
	doc.addPage()
		.fontSize(25)
		.text('Here is some vector graphics...', 100, 100);

	// Add some text with annotations
	doc.addPage()
		.fillColor("blue")
		.text('Here is a link!', 100, 100)
		.underline(100, 100, 160, 27, { color: "#0000FF" })
		.link(100, 100, 160, 27, 'http://google.com/');

	doc.pipe(res);
	doc.end();
}


//-----------------------------------------------------------------------------------------------------------------------
async function transaction001() {

	let date	= new Date();
	let time	= date.getTime();
	let dateSt	= new Date(time);

	let moji02 = "'{sss:" + dateSt + "}'";

    const db = await getPostgresClient();

    try {
        const sql = "INSERT INTO t_0000 (key1, key2, key3, value) VALUES ('nodeJs', '1'," + time + "," + moji02 + ")";

        await db.begin();
        await db.execute(sql);
        await db.commit();

    } catch (e) {
        await db.rollback();
        throw e;
    } finally {
        await db.release();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
async function execute_pdf(req, res) {
	const db = await getPostgresClient();


	let date = new Date();
	let time = date.getTime();
	let dateSt = new Date(time);

	let moji02 = "'{sss:" + dateSt + "}'";


	try {
		const sql = "INSERT INTO t_0000 (key1, key2, key3, value) VALUES ('nodeJs', '1'," + time + "," + moji02 + ")";

		await db.begin();
		await db.execute(sql);
		await db.commit();

	} catch (e) {
		await db.rollback();
		throw e;
	} finally {
		await db.release();
	}
}

//-----------------------------------------------------------------------------------------------------------------------
async function make_pdf(req, res) {
	const db = await getPostgresClient();

	let reqJson = get_json_from_request(req);

	let result = [];

	try {
		let doc = new PDFDocument();
		let filename = 'abcdefg';

		filename = encodeURIComponent(filename) + '.pdf';

		res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
		res.setHeader('Content-type', 'application/pdf');
		const content = req.body.content;
		doc.y = 300;
		doc.text(content, 50, 50);

		// Embed a font, set the font size, and render some text
		doc.font('public/fonts/ipaexg.ttf')
			.fontSize(25)
			.text('Some text with an embedded font!', 100, 100);

		// Add an image, constrain it to a given size, and center it vertically and horizontally
		doc.image('public/images/image.png', {
			fit: [250, 300],
			align: 'center',
			valign: 'center'
		});

		// Add another page
		doc.addPage()
			.fontSize(25)
			.text('Here is some vector graphics...', 100, 100);

		// Add some text with annotations
		doc.addPage()
			.fillColor("blue")
			.text('Here is a link!', 100, 100)
			.underline(100, 100, 160, 27, { color: "#0000FF" })
			.link(100, 100, 160, 27, 'http://google.com/');

		doc.pipe(res);
		doc.end();
	} catch (e) {
		await db.rollback();
		throw e;
	} finally {
		await db.release();

		return reqJson;
	}
}


module.exports = router;
