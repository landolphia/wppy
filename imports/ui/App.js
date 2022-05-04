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
		return ThoughtsCollection.find({}, { sort: { createdAt: -1 } });
	},
});

Template.thought.onCreated( function thoughtOnCreated() {
	this.showChildren = new ReactiveVar( false );
	Log.info("THought created!? -> " + this.showChildren);
});

Template.thought.helpers({
	thoughtExpanded() {
		Log.info("Expanded!? -> " + Template.instance().showChildren.get());
		result = Template.instance().showChildren.get();
		return result;
	},
	isUserLogged() {
		Log.info("Hey");
		return isUserLogged();
	}
});

Template.thought.events({
	'click .root-thought'() {
		Template.instance().showChildren.set(!Template.instance().showChildren.get());
		result = Template.instance().showChildren.get();
		Log.info("Expand!? -> " + result);
		Log.info("I clicked a thought:" + this._id);
		Log.info("This is where I should expand the child thoughts and add a form.");
	},
	"submit .add-form"(event) {
		event.preventDefault();

		const target = event.target;
		const text = target.text.value;

		Log.info("This.id = " + this._id);

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
