var mysql      = require('mysql');

function testConnection(){
	var myconnection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root',
		  database : 'friendsbook'
		});
	return myconnection;
}


function fetch(callback,sqlquery){
	
	console.log("\nSQL Query::"+sqlquery);
	
	var con=testConnection();
	
	con.query(sqlquery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			//console.log("DB Results:"+rows);
			console.log(rows.length);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	con.end();
}


function insert(callback,sqlquery,insertdata){
	
	console.log("\nSQL Query::"+sqlquery);
	
	var con=testConnection();
	
	var query = con.query(sqlquery, insertdata, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("last insert id: "+result.insertId);
			callback(err, result.insertId);
		}	
	});
	
	con.end();
}

function update(callback,sqlquery,updatedata){
	
	console.log("\nSQL Query::"+sqlquery);
	
	var con=testConnection();
	
	var query = con.query(sqlquery, updatedata, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log(result);
			callback(err, result.insertId);
		}	
	});
	
	con.end();
}
function deleteRecord(callback,sqlquery,updatedata){
	
	console.log("\nSQL Query::"+sqlquery);
	
	var con=testConnection();
	
	var query = con.query(sqlquery, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log(result);
			callback(err, result.insertId);
		}	
	});
	
	con.end();
}

exports.connect=testConnection;
exports.fetch=fetch;
exports.insert=insert;
exports.update=update;
exports.deleteRecord=deleteRecord;

