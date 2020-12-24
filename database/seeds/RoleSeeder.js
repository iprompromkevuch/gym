'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Role = use('App/Models/Role');

class RoleSeeder {
  async run () {
      await Role.create({
        name: 'client',
        weight: 1
      });
      await Role.create({
        name: 'trainer',
        weight: 0
      });
      await Role.create({
        name: 'owner',
        weight: 9
      });
      await Role.create({
        name: 'manager',
        weight: 5
      });
      await Role.create({
        name: 'sales agent',
        weight: 4
      });
      await Role.create({
        name: 'admin',
        weight: 10
      });
  }
}

module.exports = RoleSeeder
