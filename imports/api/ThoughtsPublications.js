import { Meteor } from 'meteor/meteor';
import { ThoughtsCollection } from '/imports/db/ThoughtsCollection';

Meteor.publish('thoughts', function publishThoughts() {
	console.log("Subscribtion to thoughts.");
	return ThoughtsCollection.find({ origin: {$exists: false}});
});

Meteor.publish('leaves', function publishLeaves(origin) {
	console.log("Subscribtion to leaves #" + origin);
	if ( this.userId) {
		result = ThoughtsCollection.find({ origin: origin}).count();
		console.log("Count = " + result);
		return ThoughtsCollection.find({
			origin: origin
		});
	}
});
