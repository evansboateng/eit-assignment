import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Eits = new Mongo.Collection('eits');

if (Meteor.isServer) {
  Meteor.publish('eits', () => {
    return Eits.find();
  });
}

Meteor.methods({
  'eit.insert'(createObj) {
    check(createObj, Object);
    const {firstName, surname, age, country} = createObj;

    if (!this.userId) throw new Meteor.Error('not-authorized');

    Eits.insert({
      firstName,
      surname,
      age,
      country,
      addedBy: this.userId,
      createdAt: new Date()
    });
  },
  'eit.update'(eitId, updateObj) {
    check(eitId, String);
    check(updateObj, Object);

    // get the addedBy
    const doc = Eits.findOne({_id: eitId});

    // check if user is logged in and eit was added by user
    if (doc.addedBy !== this.userId) throw new Meteor.Error('not-authorized');

    const {firstName, surname, age, country} = updateObj;
    Eits.update(eitId, {
      $set: {
        firstName,
        surname,
        age,
        country,
        updatedAt: new Date()
      }
    });
  },
  'eit.delete'(id) {
    check(id, String);

    // get the addedBy
    const doc = Eits.findOne({_id: id});

    // check if user is logged in and eit was added by user
    if (doc.addedBy !== this.userId) throw new Meteor.Error('not-authorized');

    Eits.remove(id);
  },
  'eit.bulkDelete'() {
    // get the addedBy
    // const doc = Eits.findOne({_id: eitId});

    // check if user is logged in and eit was added by user
    if (!this.userId) throw new Meteor.Error('not-authorized');

    Eits.remove({checked: {$eq: true}});
  },
  'eit.isChecked'(id, setCheck) {
    check(id, String);
    check(setCheck, Boolean);

    // get the addedBy
    const doc = Eits.findOne({_id: eitId});

    // check if user is logged in and eit was added by user
    if (!this.userId && doc.addedBy !== this.userId)
      throw new Meteor.Error('not-authorized');

    Eits.update(id, {$set: {checked: setCheck}});
  }
});
