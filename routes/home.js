var con = require('./mysql');
con.connect();
/*
 * GET home page.
*/

exports.load = function(req, res){
	if(req.session.data != "" || req.session.data != "undefined"){
		
		var d = new Date(req.session.lastlogin);
		var dateStr = d.toDateString();
		var timeStr = d.toTimeString()
		 
		res.render('home', { title: 'Home', 'lastlogin' : dateStr+" "+timeStr});

	}
	else{
		res.redirect('/');
	}
	
};

exports.user = function(req, res){

	if(req.session.hasOwnProperty("userunkid")){
		var query="select * from user_master WHERE userunkid="+req.session.userunkid;
		
		con.fetch(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					res.send({"msg":"Success","data":results});
				}
				else {
					res.send({"msg":"Fail","data":""});
				}
				
			}
		},query);
	}else{
		res.send({"msg":"Fail","data":""});
	}
};

exports.saveCommunity = function(req, res){
	if(req.session.data != "" || req.session.data != "undefined"){
		
		var insertdata  = {"community_name": req.body.data, "userunkid": req.body.userunkid};
		
		var sql ="INSERT INTO community_master SET ?";
		
		con.insert(function(err,results){
			if(err){
				throw err;
			}
			else
			{
				res.send({"msg":"Success", "communityid": results});
			}
		},sql,insertdata);

	}
	else{
		res.redirect('/');
	}
	
};



exports.getCommunityList = function(req, res){
	if(req.session.hasOwnProperty("userunkid")){
		var query="select communityunkid, community_name from community_master ORDER BY communityunkid";
		
		con.fetch(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					res.send({"msg":"Success","data":results});
				}
				else {
					res.send({"msg":"Fail","data":""});
				}
				
			}
		},query);
	}else{
		res.send({"msg":"Fail","data":""});
	}
};

exports.saveNewPost = function(req, res){
	if(req.session.data != "" || req.session.data != "undefined"){
		
		var communityunkid = req.body.communityunkid;
		var post = req.body.new_post;
		var userunkid = req.body.userunkid;
		
		var insertdata  = {"communityunkid": communityunkid, "post": post, "userunkid": userunkid};
		var sql ="INSERT INTO post_master SET ?";
		
		con.insert(function(err,results){
			if(err){
				throw err;
			}
			else
			{
				res.send({"msg":"Success", "postid": results});
			}
		},sql,insertdata);

	}
	else{
		res.redirect('/');
	}
	
};

exports.saveNewComment = function(req, res){
	if(req.session.data != "" || req.session.data != "undefined"){
		
		var communityunkid = req.body.communityunkid;
		var postunkid = req.body.current_post;
		var userunkid = req.body.current_user;
		var comment = req.body.new_comment;
		
		var insertdata  = {"postunkid": postunkid, "userunkid" : userunkid, "comment": comment};
		var sql ="INSERT INTO comment_master SET ?";
		
		con.insert(function(err,results){
			if(err){
				throw err;
			}
			else
			{
				res.send({"msg":"Success", "commnetid": results});
			}
		},sql,insertdata);

	}
	else{
		res.redirect('/');
	}
	
};
exports.getCommunityPost = function(req, res){
	var communityunkid = req.params.current_community;
	var query="SELECT post_master.postunkid, post_master.communityunkid, post_master.post," +
			" comment_master.commentunkid, comment_master.comment,  " +
			"user_master.firstname, user_master.lastname " +
			"FROM post_master " +
			"LEFT JOIN comment_master ON comment_master.postunkid = post_master.postunkid " +
			"LEFT JOIN user_master ON  comment_master.userunkid= user_master.userunkid " +
			"WHERE post_master.communityunkid="+communityunkid+" ORDER BY post_master.postunkid ";
	
	con.fetch(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				res.send({"msg":"Success","data":results});
			}
			else {
				res.send({"msg":"Fail","data":""});
			}
			
		}
	},query);
	
};


