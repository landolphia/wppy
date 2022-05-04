import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Log } from 'meteor/logging';

import { ThoughtsCollection } from '/imports/db/ThoughtsCollection';
import '/imports/api/ThoughtsMethods';
import '/imports/api/ThoughtsPublications';


const SEED_USERNAME = 'landolphia';
const SEED_PASSWORD = 'password';
const SEED_USERNAME2 = 'aihplodnal';

const insertThought = (data) => {
	if ( data.text != undefined ) {
		Log.debug("User = " + JSON.stringify(data.user));
		name = Meteor.users.findOne({_id: data.user._id}).username;
		Log.debug("Username = " + name);
		if ( name != undefined ) {
			ThoughtsCollection.insert({
				text: data.text,
				userId: data.user._id,
				userName: name,
				createdAt: new Date(),
				origin: data.origin || null 
			});
		} else {
			Log.error("Invalid user.");
			Log.error("ID: " + user._id + " / Name: " + name);
		}
	} else {
		Log.error("Invalid data when trying to insert thought.");
		Log.error("[" + JSON.stringify(data) + "]");
	}
};

Meteor.startup(() => {
	Log.info("WPPY Server starting.");

	if (!(Accounts.findUserByUsername(SEED_USERNAME)
	&& Accounts.findUserByUsername(SEED_USERNAME2))) {
		Log.info("Creating dummy users.");
		Accounts.createUser({
			username: SEED_USERNAME,
			password: SEED_PASSWORD,
		});
		Accounts.createUser({
			username: SEED_USERNAME2,
			password: SEED_PASSWORD,
		});
	}
	Log.info("Dummy user accounts already created.")

	Log.info("Deleting DB items: " + ThoughtsCollection.find().count());
	ThoughtsCollection.remove({});
	Log.info("DB items: " + ThoughtsCollection.find().count());
	if (ThoughtsCollection.find().count() === 0) {
		const user = Accounts.findUserByUsername(SEED_USERNAME);
		
		Log.info("Populating DB with placeholder data.");
		[
			{ text: "Most cats have legs.", user: user },
			{ text: "Some dogs have ears.", user: user },
			{ text: "Many legs have toes.", user: user },
			{ text: "Few bears have plants.", user: user }
		].forEach(insertThought)
	}
	Log.info("DB items: " + ThoughtsCollection.find().count());
});
