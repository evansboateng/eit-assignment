import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Eits = new Mongo.Collection('eits');

Meteor.methods({
  'eit.insert'(createObj) {
    check(createObj, Object);
    const {firstName, surname, age, country} = createObj;

    if (!Meteor.user()) throw new Meteor.Error('not-authorized');

    Eits.insert({
      firstName,
      surname,
      age,
      country,
      createdAt: new Date()
    });
  },
  'eit.update'(eitId, updateObj) {
    check(eitId, String);
    check(updateObj, Object);

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

    Eits.remove(id);
  },
  'eit.bulkDelete'() {
    Eits.remove({checked: {$eq: true}});
  },
  'eit.isChecked'(id, setCheck) {
    check(id, String);
    check(setCheck, Boolean);

    Eits.update(id, {$set: {checked: setCheck}});
  }
});
