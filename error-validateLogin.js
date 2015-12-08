if (Meteor.isClient) {  
	Template.register.events({
		 'submit form': function(event){
            event.preventDefault();
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
			console.log('Calling createuser');
            Accounts.createUser({
                email: email,
				username: 'a', //THIS VIOLATES THE SCHEMA AS USERNAME MUST BE MORE THAN 3 LETTERS
                password: password
            },function (err) {
                if (err) {
                    console.log(err.message);
				}else {
				    console.log('All Ok');
				}
			});
        }
	});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Accounts.onCreateUser(function(options, user) {
	    console.log('inside onCreateUser');
        if (Meteor.userId())
            throw new Meteor.Error('Already logged in!');
        if (!options.username)
            throw new Meteor.Error('Provide a name!');
        if (options.username === '')
            throw new Meteor.Error('name cannot be empty!');
		if (options.email === '')
            throw new Meteor.Error('email cannot be empty!');
        //does this user already exist?
        if (Accounts.findUserByUsername(options.username)) {
            var err = new Meteor.Error('name already exists');
	        err.reason ='name already exists';//reason also set
            throw err;
        }
        if (Accounts.findUserByEmail(options.email)) {
            var err = new Meteor.Error('email id already exists');
	        err.reason ='email id already exists';//reason also set
            throw err;
        }
        // We still want the default hook's 'profile' behavior.
        user.username = options.username;
		user.role = 'Normal';
        console.log("called onCreateUser successfully!"+user.username);
        return user;
    });
	
    // called whenever a login is attempted
    //The following function results in a stack overflow when used
    //with aldeed:collection2 after creation of user is invalid
    Accounts.validateLoginAttempt(function(attempt){
        return true;
    });
  });
}
