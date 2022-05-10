import { Meteor } from 'meteor/meteor';
import { ThoughtsCollection } from '/imports/db/ThoughtsCollection';

Meteor.publish('thoughts', function publishThoughts() {
	if ( this.userId) {
		return ThoughtsCollection.find({
			origin: null
		});
	} else {
		return ThoughtsCollection.find({ origin: null});
	}
});

Meteor.publish('leaves', function publishLeaves(origin) {
	console.log("Subscribtion to leaves #" + origin);
	if ( this.userId) {
		return ThoughtsCollection.find({
			origin: origin
		});
	}
});
