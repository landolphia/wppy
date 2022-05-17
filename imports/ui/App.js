import { Template } from 'meteor/templating';
import { Log } from 'meteor/logging';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import { ThoughtsCollection } from "../db/ThoughtsCollection";
import './App.html';
import './Login.js';

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();
const IS_LOADING_STRING = "isLoading";

Template.mainContainer.onCreated( function mainContainerOnCreated() {
	this.state = new ReactiveDict();

	const handler = Meteor.subscribe('thoughts');
	Tracker.autorun(() => {
		this.state.set(IS_LOADING_STRING, !handler.ready());
	});
});

Template.mainContainer.helpers({
	isLoading() {
		const instance = Template.instance();
		return instance.state.get(IS_LOADING_STRING);
	}
});

Template.thoughtList.helpers({
	thoughts() {
		return ThoughtsCollection.find({origin : {$exists: false}}, { sort: { createdAt: -1 } });
	},
});

Template.thought.onCreated( function thoughtOnCreated() {
	this.showChildren = new ReactiveVar( false );
});

Template.thought.helpers({
	thoughtExpanded() {
		result = Template.instance().showChildren.get();
		return result;
	},
	isUserLogged() {
		return isUserLogged();
	}
});

Template.thought.events({
	'click .list-stem'() {
		Template.instance().showChildren.set(!Template.instance().showChildren.get());
	},
	"submit .add-form"(event) {
		event.preventDefault();

		const target = event.target;
		const text = target.text.value;

		Log.info("Inserting leaf. Root = " + this._id);

		Meteor.call('thoughts.insert', text, this._id);

		target.text.value = '';
	}
});

Template.stemForm.helpers({
	getUser() {
		return getUser();
	},
	isUserLogged() {
		return isUserLogged();
	}
});

Template.stemForm.events({
	'click .user'() {
		Meteor.logout();
	},
	"submit .stem-form"(event) {
		event.preventDefault();

		const target = event.target;
		const text = target.text.value;

		Meteor.call('thoughts.insert', text);

		target.text.value = '';
	}
})

Template.leavesList.helpers({
	leaves(origin) {
		Log.info("This is the origin: " + this.origin);
		return ThoughtsCollection.find({origin: this.origin}, { sort: { createdAt: -1 } });
	},
});

Template.leavesList.onCreated( function leavesListOnCreated() {
	var dataContext = Template.currentData()
	Log.info("This is the thingy: " + dataContext.origin);
	//var handler = Meteor.subscribe('leaves', dataContext.origin);
	Meteor.subscribe('leaves', dataContext.origin);
	//var instance = Template.instance();
	//Tracker.autorun(() => {
	//	this.state.set(IS_LOADING_STRING, !handler.ready());
	//})
});

//Template.leavesList.helpers({
//	leaves() {
//		var dataContext = Template.currentData()
//		Log.info("This nern: " + dataContext.origin);
//		result = ThoughtsCollection.find({origin: origin}, { sort: { createdAt: -1 } });
//		Log.info("Count: " + result.count());
//		Log.info("Better count: " + ThoughtsCollection.find({origin: origin}, { sort: { createdAt: -1 } }).count());;
//		//result = ThoughtsCollection.find({origin: origin}, { sort: { createdAt: -1 } });
//		//return result;
//		return result;
//	},
//});
