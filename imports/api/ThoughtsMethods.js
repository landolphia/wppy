import { check } from 'meteor/check';
import { Log } from 'meteor/logging';
import { ThoughtsCollection } from '../db/ThoughtsCollection';
 
Meteor.methods({
	'thoughts.insert'(text) {
		check(text, String);

		if (!this.userId) {
			throw new Meteor.Error('Not authorized.');
		}


		name = Meteor.users.findOne({_id: this.userId}).username;
		Log.info("NAME: " + name);

		ThoughtsCollection.insert({
			text,
			createdAt: new Date,
			userId: this.userId,
			userName: name
		});
	},
	'thoughts.insert'(text, origin) {
		check(text, String);

		if (!this.userId) {
			throw new Meteor.Error('Not authorized.');
		}


		name = Meteor.users.findOne({_id: this.userId}).username;
		Log.info("NAME: " + name);

		ThoughtsCollection.insert({
			text,
			createdAt: new Date,
			userId: this.userId,
			userName: name,
			origin: origin
		});
	},
 
  //'thoughts.remove'(thoughtId) {
  //  check(thoughtId, String);
 
  //  if (!this.userId) {
  //    throw new Meteor.Error('Not authorized.');
  //  }
 
  //  TasksCollection.remove(taskId);
  //},
 
  //'tasks.setIsChecked'(taskId, isChecked) {
  //  check(taskId, String);
  //  check(isChecked, Boolean);
 
  //  if (!this.userId) {
  //    throw new Meteor.Error('Not authorized.');
  //  }
 
  //  TasksCollection.update(taskId, {
  //    $set: {
  //      isChecked
  //    }
  //  });
  //}
});
