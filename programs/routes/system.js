let express = require('express');
let router = express.Router();
let co = require("co");
let fs = require("fs");

require('../public/javascripts/myjs/myNodeModule.js');

const { getPostgresClient } = require('../public/javascripts/myjs/postgres.js');

/* POST home page. **** /calc/execute  *******************************************************************/
router.post('/execute', function (req, res) {
	let executeName = evalExecute(req, res);
	eval(executeName);
});

module.exports = router;
