import { Meteor } from 'meteor/meteor';
import { ThoughtsCollection } from '/imports/db/ThoughtsCollection';

Meteor.publish('thoughts', function publishThoughts() {
	if ( this.userId) {
		return ThoughtsCollection.find({
			userId: this.userId,
			origin: null
		});
	} else {
		return ThoughtsCollection.find({ origin: null});
	}
});

Meteor.publish('thoughtChildren', function publishThoughtChildren(stem) {
	Log.error("This might be messed up. Publications are unique. Might need to nest replies to the origin.");
	if ( this.userId) {
		return ThoughtsCollection.find({
			userId: this.userId,
			origin: stem
		});
	}
});
