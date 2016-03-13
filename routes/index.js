
/*
 * GET home page.
 */
var con = require('./mysql');
con.connect();

exports.index = function(req, res){
	res.render('index', { title: "Community Book",errMsg: "" });
};


exports.login = function(req, res){
	
	try {
		var param = req.body;
		var errMsg = '';
		
		if(param.btnRegister != "Join Now"){
			
			if(param.inputEmail == "" || param.inputEmail == "undefined"){
				errMsg += 'Email is required.';
				res.render('index', { title: 'Friends Book',errMsg: errMsg });
			}
			else if(param.inputPassword == "" || param.inputPassword == "undefined"){
				errMsg += 'Password is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else{
				var validateUser="select (userunkid), logindatetime from user_master where email='"+param.inputEmail+"' AND password='"+param.inputPassword+"'";
				console.log("Query is:"+validateUser);
				
				con.fetch(function(err,results){
					if(err){
						throw err;
					}
					else 
					{
						if(results.length > 0){
							console.log("valid Login");
							
							req.session.userunkid =  results[0].userunkid;
							
							var query2 = 'UPDATE user_master SET logindatetime = NOW() WHERE  user_master.userunkid = '+results[0].userunkid;
							
							con.update(function(err,results2){
								if(err){
									throw err;
									res.send({"msg":"Error"});
								}
								else
								{
									res.redirect('/home');//{"userunkid":results[0].userunkid, "firstname":results[0].firstname, "lastname":results[0].lastname}
								}
							},query2);
							
							//req.session.data = {};
							
							//req.session.data.firstname = results[0].firstname;//req.session.firstname = results[0].firstname;
							//req.session.data.lastname = results[0].lastname;//req.session.lastname = results[0].lastname;
							
						//	res.send({"login":"Success"});
						}
						else {    
							
							console.log("Invalid Login");
							//res.send({"errMsg":"Fail"});
							res.render('index', { title: 'LinkedIn',errMsg: "Invalid Login" });
						}
					}  
				},validateUser);
			}
		}
		else{
			console.log("0000000");
			if(param.txtEmail == "" || param.txtEmail == "undefined"){
				errMsg += 'Email is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else if(param.txtPassword == "" || param.txtPassword == "undefined"){
				errMsg += 'Password is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else if(param.txtFirstName == "" || param.txtFirstName == "undefined"){
				errMsg += 'First Name is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else if(param.txtLastName == "" || param.txtLastName == "undefined"){
				errMsg += 'Last Name is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else
			{
				var checkUser="select (userunkid) from user_master where email='"+param.txtEmail+"'";
				
				con.fetch(function(err,result){
					console.log("test");
					if(err){
						throw err;
					}
					else 
					{
						console.log("RESULT");
						if(result.length > 0){
							console.log("IF");
							res.render('index', { title: 'Friends Book',errMsg: "User Already Exists." });
							
						}
						else { 
						  var insertdata  = {"firstname": param.txtFirstName, "lastname": param.txtLastName, "email": param.txtEmail, "password": param.txtPassword, "logindatetime" : new Date()};
							var newUser="INSERT INTO user_master SET ?";
							
							con.insert(function(err,results){
								console.log(results);
								if(err){
									throw err;
								}
								else 
								{
									req.session.userunkid =  results;
									res.redirect('/home');
				
								}  
							},newUser,insertdata);
						}
					}  
				},checkUser);
			}
			
			//res.render('index', { title: 'LinkedIn',errMsg: errMsg });
		}
		
	}
	catch(err) {
		console.log(err);
		res.send({"errMsg":err});
	}
	
	
};