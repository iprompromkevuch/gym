'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database');


class DailyActivityV1Seeder {
  async run () {
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('male', 0.95, 'beginner')`
    );
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('male', 0.96, 'intermediate')`
    );
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('male', 0.97, 'semi moderate')`
    );
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('male', 0.98, 'pro')`
    );
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('male', 0.99, 'heavy')`
    );

    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('female', 0.93, 'beginner')`
    );
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('female', 0.95, 'intermediate')`
    );
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('female', 0.97, 'semi moderate')`
    );
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('female', 0.99, 'pro')`
    );
    await Database.raw(`
        INSERT INTO daily_activity_v1 (gender, multiplier, activity_level)
        VALUES('female', 0.98, 'heavy')`
    );
  }
}

module.exports = DailyActivityV1Seeder;
