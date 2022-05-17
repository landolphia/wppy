import { check } from 'meteor/check';
import { Log } from 'meteor/logging';
import { ThoughtsCollection } from '../db/ThoughtsCollection';
 
Meteor.methods({
	'thoughts.insert'(text, origin) {
		check(text, String);

		if (!this.userId) {
			throw new Meteor.Error('Not authorized.');
		}

		name = Meteor.users.findOne({_id: this.userId}).username;
		Log.debug(name + " is inserting a thought: " + text + " ||| " + origin);

		ThoughtsCollection.insert({
			text: text,
			createdAt: new Date,
			userId: this.userId,
			userName: name,
			origin: origin
		});
	},
});
