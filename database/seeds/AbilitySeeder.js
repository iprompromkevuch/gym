'use strict'

/*
|--------------------------------------------------------------------------
| AbilitySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Database = use('Database');

class AbilitySeeder {
  async run () {
    await Database.table('abilities').insert({ ability_level : 'beginner'});
    await Database.table('abilities').insert({ ability_level : 'intermediate'});
    await Database.table('abilities').insert({ ability_level : 'advanced'});
  }
}

module.exports = AbilitySeeder
