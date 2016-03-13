var app = angular.module('test', ['ngRoute']);


app.config(['$routeProvider',
            function($routeProvider,$locationProvider) {
				$routeProvider.
				when('/home', {
					controller: 'homeController'
     
				}).
                otherwise({
                  redirectTo: '/home',
                });
              //$locationProvider.html5Mode(true);
          }

]);



app.controller('logoutController',function($scope){
	console.log("logoutController");
	$http({
        method: 'DELETE',
        url: '/api/session',
        
     }).success(function(response){
       
        console.log(response);
        window.location = '/';
    }).error(function(error){
        alert("error");
    });
});

var current_community;
var current_user;
app.controller('homeController', function($scope,$http) {
	
	$scope.CommunityListObj = {};
	
	$http.get("/user").success(function(response){
		if(response.msg == "Fail"){
			alert("Session Expired. Please Login to continue.");
			window.location.href = "/";
			return false;
		}else{
			response.data[0].logindatetime = new Date(Date.parse(response.data[0].logindatetime));
			console.log(response.data[0]);
			$scope.user = response.data[0];
			console.log($scope.user.logindatetime);
			current_user=$scope.user.userunkid;
		}
		
	});
	
	$http.get('/communities/').success(function(response){
		if(response.msg != "Fail"){
			$scope.CommunityListObj= response.data;
			current_community = $scope.CommunityListObj[0].communityunkid;
			
			$http.get('/posts/'+current_community).success(function(res){
				$scope.PostListObj= res.data;
				var postlist = [];
				var len=-1;
				var commentlen = 0;
				
				$(res.data).each(function(key,obj){
					
					if($.inArray(obj.postunkid,postlist) == -1){
						++len;
						postlist.push(obj.postunkid);
						flag=1;
						
						if(len == 0){
							  $scope.PostListObj  = [{"postunkid": obj.postunkid,"communityunkid": obj.communityunkid, "post": obj.post, "comment": []}];
						}
						else{
							$scope.PostListObj[len] = {"postunkid": obj.postunkid,"communityunkid": obj.communityunkid, "post": obj.post, "comment": []};
						}
					}
					if(obj.commentunkid != null){
						$($scope.PostListObj).each(function(index,ob){
							if(ob.postunkid == obj.postunkid)
								$scope.PostListObj[index].comment.push({"commentunkid ": obj.commentunkid, "comment": obj.comment, "firstname": obj.firstname, "lastname": obj.lastname});
								
						});
					}
				});
				
			});
		}
	});
	
	
	
	$scope.logout = function() {
		$http({
	        method: 'DELETE',
	        url: '/api/session',
	        
	     }).success(function(response){
	       
	        console.log(response);
	        window.location = '/';
	    }).error(function(error){
	        alert("error");
	    });
	};
	
	$scope.updateCurrentCommunity = function(obj) {
		current_community = obj.community.communityunkid;
		$(".community").removeClass("active");
		$("#community_"+current_community).addClass("active");
		
		$http.get('/posts/'+current_community).success(function(res){
			$scope.PostListObj= res.data;
			var postlist = [];
			var len=-1;
			var commentlen = 0;
			
			$(res.data).each(function(key,obj){
							
				if($.inArray(obj.postunkid,postlist) == -1){
					++len;
					postlist.push(obj.postunkid);
					flag=1;
					
					if(len == 0){
						  $scope.PostListObj  = [{"postunkid": obj.postunkid,"communityunkid": obj.communityunkid, "post": obj.post, "comment": []}];
					}
					else{
						$scope.PostListObj[len] = {"postunkid": obj.postunkid,"communityunkid": obj.communityunkid, "post": obj.post, "comment": []};
					}
				}
				if(obj.commentunkid != null){
					$($scope.PostListObj).each(function(index,ob){
						if(ob.postunkid == obj.postunkid)
							$scope.PostListObj[index].comment.push({"commentunkid ": obj.commentunkid, "comment": obj.comment, "firstname": obj.firstname, "lastname": obj.lastname});
							
					});
				}
			});
		});
	};
	
	
	$scope.saveCommunity = function() {
		
		$http.post('/community', {"data": $scope.txtCommunityName, "userunkid": current_user}).
		  success(function(data, status, headers, config) {
			  $scope.newCommunityObj = {'community_name':$("#txtCommunityName").val()};
			  var len = $scope.CommunityListObj.length;
			  $scope.newCommunityObj.communityunkid = data.communityid;
			  
			  $scope.CommunityListObj[len] = $scope.newCommunityObj;
			  var obj = $scope.newCommunityObj;
			  
			  //Update Community
			  current_community = obj.communityunkid;
			  $(".community").removeClass("active");
			  $("#community_"+current_community).addClass("active");
				
				$http.get('/posts/'+current_community).success(function(res){
					$scope.PostListObj= res.data;
					var postlist = [];
					var len=-1;
					var commentlen = 0;
					
					$(res.data).each(function(key,obj){
									
						if($.inArray(obj.postunkid,postlist) == -1){
							++len;
							postlist.push(obj.postunkid);
							flag=1;
							
							if(len == 0){
								  $scope.PostListObj  = [{"postunkid": obj.postunkid,"communityunkid": obj.communityunkid, "post": obj.post, "comment": []}];
							}
							else{
								$scope.PostListObj[len] = {"postunkid": obj.postunkid,"communityunkid": obj.communityunkid, "post": obj.post, "comment": []};
							}
						}
						if(obj.commentunkid != null){
							$($scope.PostListObj).each(function(index,ob){
								if(ob.postunkid == obj.postunkid)
									$scope.PostListObj[index].comment.push({"commentunkid ": obj.commentunkid, "comment": obj.comment, "firstname": obj.firstname, "lastname": obj.lastname});
									
							});
						}
					});
				});
			  $('#myModal').modal('hide');
			  
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	
	$scope.savePost = function() {
		$http.post('/post', {"new_post": $scope.txtNewPost, "communityunkid":current_community, "userunkid":current_user}).
		  success(function(data, status, headers, config) {
			  console.log(1);
			  $scope.newPostObj = {'communityunkid' :current_community,'post':$("#txtNewPost").val(), 'comment':[]};
			  $scope.newPostObj.postunkid = data.postid;
			  var len = $scope.PostListObj.length;
			  
			  if(len == 0){
				  $scope.PostListObj = [$scope.newPostObj];
			  }
			  else{
				  $scope.PostListObj[len] = $scope.newPostObj;
			  }
			 

			  console.log($scope.PostListObj);
			  $('#NewPostModal').modal('hide');
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	var current_post;
	$scope.newComment = function(obj) {
		current_post = obj.post.postunkid;
	};
	$scope.saveComment = function() {
		
		$http.post('/comment', {"new_comment": $scope.txtNewComment, "communityunkid":current_community, "current_post":current_post,"current_user":current_user}).
		  success(function(data, status, headers, config) {
			  $($scope.PostListObj).each(function(index,ob){
					if(ob.postunkid == current_post){
						$scope.PostListObj[index].comment.push({"commentunkid ": data.commentid, "comment": $scope.txtNewComment, "firstname": $scope.user.firstname, "lastname": $scope.user.lastname});
					}	
				});	
			  $("#divPost_"+current_post).scrollTop( $("#divPost_"+current_post)[0].scrollHeight);
			  $('#NewCommentModal').modal('hide');
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	
});
