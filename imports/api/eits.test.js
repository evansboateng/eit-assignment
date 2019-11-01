import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {assert} from 'chai';
import {Accounts} from 'meteor/accounts-base';

import {Eits} from './eits.js';

if (Meteor.isServer) {
  describe('Eits', () => {
    const username = 'duke';
    let eitId, userId;

    before(() => {
      let user = Meteor.users.findOne({username: username});
      if (!user) {
        userId = Accounts.createUser({
          username,
          email: 'u@me.com',
          password: '123456'
        });
      } else {
        userId = user._id;
      }
    });

    beforeEach(() => {
      eitId = Eits.insert({
        firstName: 'SomeBody',
        surname: 'Name',
        age: '25',
        country: 'Somewhere',
        addedBy: userId,
        createdAt: new Date()
      });
    });

    afterEach(() => {
      Eits.remove({});
    });

    // add eit if logged in
    it('add eit if logged in', () => {
      let eitObject = {
        firstName: 'Prim',
        surname: 'Mz',
        age: '23',
        country: 'Zim',
        addedBy: userId,
        createAt: new Date()
      };

      const insertEit = Meteor.server.method_handlers['eit.insert'];
      const invocation = {userId};
      insertEit.apply(invocation, [eitObject]);
      assert.strictEqual(Eits.find().count(), 2);
    });

    //  can not add eit if not logged in
    it('cannot add eit if not logged in', () => {
      let eitObject = {
        firstName: 'Prim',
        surname: 'Mz',
        age: '23',
        country: 'Zim',
        addedBy: userId,
        createAt: new Date()
      };

      const insertEit = Meteor.server.method_handlers['eit.insert'];
      const invocation = {};
      assert.throws(
        () => insertEit.apply(invocation, [eitObject]),
        Meteor.Error,
        '[not-authorized]'
      );
      assert.strictEqual(Eits.find().count(), 1);
    });

    // can edit own eit
    it('can edit own eit', () => {
      let updateObj = {
        firstName: 'Prim',
        surname: 'Mz',
        age: '23',
        country: 'Zim',
        updatedAt: new Date()
      };

      const updateEit = Meteor.server.method_handlers['eit.update'];
      const invocation = {userId};
      updateEit.apply(invocation, [eitId, updateObj]);
      assert.strictEqual(Eits.find().count(), 1);
    });

    // cannot edit someone eit
    it('cannot edit someone eit', () => {
      let updateObj = {
        firstName: 'Prim',
        surname: 'Mz',
        age: '23',
        country: 'Zim',
        updatedAt: new Date()
      };

      const userId = Random.id();

      const updateEit = Meteor.server.method_handlers['eit.update'];
      const invocation = {userId};
      // updateEit.apply(invocation, [eitId, updateObj]);
      assert.throws(
        () => updateEit.apply(invocation, [eitId, updateObj]),
        Meteor.Error,
        '[not-authorized]'
      );
      assert.strictEqual(Eits.find().count(), 1);
    });

    // can delete own eit
    it('can delete own eit', () => {
      const deleteEit = Meteor.server.method_handlers['eit.delete'];
      const invocation = {userId};
      deleteEit.apply(invocation, [eitId]);
      assert.strictEqual(Eits.find().count(), 0);
    });

    // cannot delete if not logged in
    it('cannot delete if not logged in', () => {
      const deleteEit = Meteor.server.method_handlers['eit.delete'];
      const invocation = {};
      assert.throws(
        () => deleteEit.apply(invocation, [eitId]),
        Meteor.Error,
        '[not-authorized]'
      );
      assert.strictEqual(Eits.find().count(), 1);
    });

    // cannot delete someone eit
    it('cannot delete someone eit', () => {
      const userId = Random.id();
      const deleteEit = Meteor.server.method_handlers['eit.delete'];
      const invocation = {userId};
      assert.throws(
        () => deleteEit.apply(invocation, [eitId]),
        Meteor.Error,
        '[not-authorized]'
      );
      assert.strictEqual(Eits.find().count(), 1);
    });

    // view eits
    it('view published eit', () => {
      let newObj = {
        firstName: 'Prim',
        surname: 'Mz',
        age: '23',
        country: 'Zim',
        createAt: new Date()
      };

      Eits.insert(newObj);

      const userId = Random.id();
      const invocation = {userId};
      const viewEits = Meteor.server.publish_handlers['eits'];
      assert.strictEqual(viewEits.apply(invocation).count(), 2);
    });

    // bulk delete
    it('can bulk delete', () => {
      let newObj = {
        firstName: 'Prim',
        surname: 'Mz',
        age: '23',
        country: 'Zim',
        createAt: new Date()
      };

      const otherId = Eits.insert(newObj);
      Eits.update(otherId, {$set: {checked: true}});
      Eits.update(eitId, {$set: {checked: true}});

      const deleteBulk = Meteor.server.method_handlers['eit.bulkDelete'];
      const invocation = {userId};
      deleteBulk.apply(invocation);
      assert.strictEqual(Eits.find().count(), 0);
    });

    // cannot bulk delete if not logged in
    it('cannot bulk delete if not logged in', () => {
      let newObj = {
        firstName: 'Prim',
        surname: 'Mz',
        age: '23',
        country: 'Zim',
        createAt: new Date()
      };

      const otherId = Eits.insert(newObj);
      Eits.update(otherId, {$set: {checked: true}});
      Eits.update(eitId, {$set: {checked: true}});

      const deleteBulk = Meteor.server.method_handlers['eit.bulkDelete'];
      const invocation = {};
      assert.throws(
        () => deleteBulk.apply(invocation),
        Meteor.Error,
        '[not-authorized]'
      );
      assert.strictEqual(Eits.find().count(), 2);
    });
  });
}
