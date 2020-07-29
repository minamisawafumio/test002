let express = require('express');
let router = express.Router();
let co = require("co");
let fs = require("fs");

require('../public/javascripts/myjs/myNodeModule.js');

const { getPostgresClient } = require('../public/javascripts/myjs/postgres.js');

/* POST home page. **** /calc/execute  *******************************************************************/
router.post('/execute', function (req, res) {
	console.log('===== calc.js execute=', '');

	let executeName = evalExecute(req, res);
	eval(executeName);

});

//------------------------------------------------------------------------------------------
function calc_init(req, res) {


	let reqJson = get_json_from_request(req);

	console.log('===== calc.js calc_init reqJson =', JSON.stringify(reqJson));


	let dateTime = new Date().getTime();
	let dateSt = new Date(dateTime);

	let uName = w_name + '***' + w_kana;

	let j05_num = Number(data005) * 3;

	let resJson = {
		methodName: reqJson.methodName,
		yama: 'kawa',
		time: dateSt,
		j05: j05_num
	}

	let json = makeJson(resJson);

	res.json(json);
}

//------------------------------------------------------------------------------------------
function method_001(req, res) {

	console.log('===== calc.js method_001=', '');

	let reqJson = get_json_from_request(req);

	let data005 = reqJson.data005;

	let dateTime = new Date().getTime();
	let dateSt = new Date(dateTime);

	let j05_num = Number(data005) * 2;

	let resJson = {
		methodName: reqJson.methodName , 
		yama: 'kawa',
		time: dateSt,
		j05: j05_num
	}

	let json = makeJson(resJson);



	console.log('===== calc.js method_001 json =', JSON.stringify(json));


	res.json(json);
}

//------------------------------------------------------------------------------------------
function method_002(req, res) {

	console.log('===== calc.js method_002=', '');

	let reqJson = get_json_from_request(req);

	let data005 = reqJson.data005;

	let dateTime = new Date().getTime();
	let dateSt = new Date(dateTime);

	let j05_num = Number(data005) * 3;

	let json = {
		methodName: reqJson.methodName, 
		yama: 'kawa',
		time: dateSt,
		j05: j05_num
	}

	console.log('===== calc.js method_002 reqJson =', JSON.stringify(json));

	let resJson = makeJson(json);

	res.json(resJson);
}

//------------------------------------------------------------------------------------------
function method_003(req, res) {

	let json = get_json_from_request(req);

	console.log('===== calc.js method_003 reqJson =', JSON.stringify(json));

	let dateTime = new Date().getTime();
	let dateSt = new Date(dateTime);

	json.time = dateSt,
	json.j05 = 0;
	json.aiu_01 = json.str1;

	let resJson = makeJson(json);

	res.json(resJson);
}

//------------------------------------------------------------------------------------------
function calc_init(req, res) {

	console.log('system.js calc_init', '***********************');

	let reqJson = get_json_from_request(req);

	let p1 = corp_search(reqJson);

	Promise.all([p1]).then(() => {
		reqJson.msg = 'ŒŸõŒ”‚ÍA' + reqJson.count + ' Œ‚Å‚·';

		let dateTime = new Date().getTime();
		let dateSt = new Date(dateTime);
		reqJson.time = dateSt;
		reqJson.time = dateSt;
		reqJson.j05 = 0;
		let json = makeJson(reqJson);
		res.json(json);
	}).catch(function (error) {
		console.error("¸”s<><><><><><><><><> error:", error.message);
		reqJson.msg = 'ŒŸõæ“¾‚É¸”s‚µ‚Ü‚µ‚½';
		let json = makeJson(reqJson);
		res.json(json);
	});
}

//-----------------------------------------------------------------------------------------------------------------------
async function corp_search(reqJson) {

	let result = [];

	let db = await getPostgresClient();

	try {
		let sql = "select count(key2) from t_0000 where key1 = 'nodeJs' and key2='1' and key3='" + reqJson.name + "'";

		console.log('>> corp_search >>>>> sql=', sql);

		await db.begin();
		let rows = await db.execute(sql);

		console.log('>> corp_search >>>>> rows=', rows);

		reqJson.count = rows[0].count;

		if (reqJson.count > 0) {
			sql = "select * from t_0000 where key1 = 'nodeJs' and key2='1' and key3='" + reqJson.name + "'";
			console.log('>>> corp_search >>>>2 sql=', sql);

			result = await db.execute(sql);

			console.log('>>> corp_search >>>> result=', result);

			reqJson.result = result;

		} else {
			console.log('else >>> corp_search >>>> ????????');
		}
	} catch (e) {
		await db.rollback();
		throw e;
	} finally {
		await db.release();

		return reqJson;
	}
}

module.exports = router;
