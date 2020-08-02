//--- postgreSQL接続 --------------------------------------
const { getPostgresClient } = require('./postgres.js');

//データ登録（postgreSQL）----------------------------------------------------------------------------------------
postgreSQL_insert = async function (iJson) {

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

//-----------------------------------------------------------------------------------------------------------------------
corp_search = async function (reqJson) {

	let result = [];

	let db = await getPostgresClient();

	try {
		let sql = "select count(key2) from t_0000 where key1 = 'nodeJs' and key2='1' and key3='" + reqJson.corpName + "'";

		console.log('>> corp_search >>>>> sql=', sql);

		await db.begin();
		let rows = await db.execute(sql);

		console.log('>> corp_search >>>>> rows=', rows);

		reqJson.count = rows[0].count;

		if (reqJson.count > 0) {
			sql = "select * from t_0000 where key1 = 'nodeJs' and key2='1' and key3='" + reqJson.corpName + "'";
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

//-----------------------------------------------------------------------------------------------------------------------
video_search = async function (reqJson) {

	let result = [];

	let db = await getPostgresClient();

	let sql = "select count(key2) from t_0000 where key1 = 'nodeJs' and key2='1' and key3='" + reqJson.corpName + "'";

	console.log('>> video_search 0 sql=', sql);

	try {

		await db.begin();
		let rows = await db.execute(sql);

		console.log('>> video_search 1 rows=', rows);

		reqJson.count = rows[0].count;

		if (reqJson.count > 0) {
			sql = "select * from t_0000 where key1 = 'nodeJs' and key2='1' and key3='" + reqJson.corpName + "'";
			console.log('>> video_search 2 sql=', sql);

			result = await db.execute(sql);

			console.log('>> video_search 3 result=', result);

			reqJson.result = result;

		} else {
			console.log('>> video_search 4 else ????????');
		}
	} catch (e) {
		await db.rollback();
		throw e;
	} finally {
		await db.release();
	}
}