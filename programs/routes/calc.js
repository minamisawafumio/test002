let express = require('express');
let router = express.Router();
let co = require("co");
let fs = require("fs");

require('../public/javascripts/myjs/myNodeModule.js');

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


	let resJson = {
		methodName: reqJson.methodName,
		yama: 'kawa',
		time: dateSt,
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

module.exports = router;
