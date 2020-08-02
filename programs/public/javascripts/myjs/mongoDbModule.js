//--- mongodb 設定 --------------------------------------
const MongoClient = require('mongodb').MongoClient;

// 接続先URL
const url2 = 'mongodb://localhost:27017';

// データベース名
const dbName2 = 'db0003';

//MongoClient用オプション設定
const connectOption = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

//----------------------------------------------------------------------------------------
insert = async function (json) {

	let client = await MongoClient.connect(url2, { useNewUrlParser: true })
		.catch(err => { console.log(err); });

	try {
		/** DBを取得 */
		let db = client.db(dbName2);

		let collection = db.collection('documents');

		let result = await collection.insertMany(json.data);

		json.result = result;

	} catch (err) {
		console.log(err);
	} finally {
		client.close();
	}
}

//-----------------------------------------------------------------------------------------------------------------------
updateM2 = async function (keyJson, valueJson, upsertJson) {

	let client = await MongoClient.connect(url2, { useNewUrlParser: true })
		.catch(err => { console.log(err); });

	try {
		let db = client.db(dbName2);

		let collection = db.collection('documents');

		let result = await collection.updateOne(keyJson, valueJson, upsertJson);

	} catch (err) {
		console.log(err);
	} finally {
		client.close();
	}
}

//-----------------------------------------------------------------------------------------------------------------------
searchM = async function (json) {

	let client = await MongoClient.connect(url2, { useNewUrlParser: true })
		.catch(err => { console.log(err); });

	try {
		let db = client.db(dbName2);

		let collection = db.collection('documents');

		let result = await collection.findOne(json);

		console.log('+++ corp_searchM result=', result);

		json.result = result;

	} catch (err) {
		console.log(err);
	} finally {
		client.close();
	}
}


//------------------------------------------------------------------------------------------------------
deleteM = async function (json) {

	let client = await MongoClient.connect(url2, { useNewUrlParser: true })
		.catch(err => { console.log(err); });

	try {
		let db = client.db(dbName2);

		let collection = db.collection('documents');

		let result = await collection.remove(json);

	} catch (err) {
		console.log(err);
	} finally {
		client.close();
	}
}