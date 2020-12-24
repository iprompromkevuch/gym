'use strict'

/*
|--------------------------------------------------------------------------
| NewAdminSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const User = use('App/Models/User');
const Hash = use('Hash');

class NewAdminSeeder {
  async run () {
      await User.create({
          email: 'admin@usaelite.zgtec.com',
          password: '12345678!',
          first_name: 'Chad',
          last_name: 'Test',
          state: 'DC',
          city: 'Washington',
          address_line1: '51st street',
          address_line2: 'Some text',
          phone: '+00000000',
          sex: 'male',
          birthdate: '1982-08-22',
          is_admin: 1
      });
  }
}

module.exports = NewAdminSeeder
