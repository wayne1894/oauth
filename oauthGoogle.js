var OauthGoogle = function(client_id){
	if(client_id==undefined)return;
	var auth2
	var googleUser; // The current user.
	
	gapi.load('auth2',function(){
		auth2 = gapi.auth2.init({
			client_id: client_id,
			scope: 'profile'
		});
	});

	var signinChanged = function (val) {
		console.log('Signin state changed to ', val);
	};	
	var userChanged = function (user) {
		console.log('User now: ', user);
		googleUser = user;
	};
	var refreshValues = function() {
		if (auth2){
			console.log('Refreshing values...');
			googleUser = auth2.currentUser.get();
		}
	}
	
	this.getGoogleUser= function(){
		if(!googleUser)return 
		var profile = googleUser.getBasicProfile();
			console.log('ID: ' + profile.getId());
			console.log('Name: ' + profile.getName());
			console.log('ImageUrl: ' + profile.getImageUrl());
			console.log('Email: ' + profile.getEmail());
			console.log('token' + googleUser.getAuthResponse().id_token);
		return googleUser
	}

	this.signOut=function(signOutCallback) {//登出
    auth2.signOut().then(signOutCallback);
  }

	this.getStatus = function(){ //監聽使用者登入狀態(並自動登入)
			if(auth2==undefined){
				that=this;
				setTimeout(function(){
					that.getStatus();
				},50);
				return
			}
		
			// Listen for sign-in state changes.
			auth2.isSignedIn.listen(signinChanged);

			// Listen for changes to current user.
			auth2.currentUser.listen(userChanged);

			// Sign in the user if they are currently signed in.
			if (auth2.isSignedIn.get() == true) {
				auth2.signIn();
			}

			// Start with the current live values.
			refreshValues();
	}
	
	this.setLoginButton=function(id,signInCallback){
		if(auth2==undefined){
				that=this;
				setTimeout(function(){
					that.setLoginButton(id,signInCallback);
				},50);
				return
			}
		auth2.attachClickHandler(document.getElementById(id), {},
		function(user) {
			googleUser=user;
			signInCallback(user)
		}, function(error) {
			//alert(JSON.stringify(error, undefined, 2));
		});
	}

}