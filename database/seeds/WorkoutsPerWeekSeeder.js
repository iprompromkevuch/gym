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


class WorkoutsPerWeek {
  async run () {
    const workoutsPerWeek = [{
        phase: 1,
        program: 'Weight Loss',
        number: 6,
    },{
        phase: 1,
        program: 'Re-costruction',
        number: 10,
    },{
        phase: 1,
        program: 'Maintaince',
        number: 8,
    },{
        phase: 1,
        program: 'Weight gain',
        number: 4,
    },{
        phase: 1,
        program: 'Contest',
        number: 6,
    },{
        phase: 2,
        program: 'Weight Loss',
        number: 10,
    },{
        phase: 2,
        program: 'Re-costruction',
        number: 6,
    },{
        phase: 2,
        program: 'Maintaince',
        number: 6,
    },{
        phase: 2,
        program: 'Weight gain',
        number: 3,
    },{
        phase: 2,
        program: 'Contest',
        number: 10,
    },{
        phase: 3,
        program: 'Weight Loss',
        number: 10,
    },{
        phase: 3,
        program: 'Re-costruction',
        number: 5,
    },{
        phase: 3,
        program: 'Maintaince',
        number: 5,
    },{
        phase: 3,
        program: 'Weight gain',
        number: 5,
    },{
        phase: 3,
        program: 'Contest',
        number: 12,
    },{
        phase: 4,
        program: 'Weight Loss',
        number: 12,
    },{
        phase: 4,
        program: 'Re-costruction',
        number: 6,
    },{
        phase: 4,
        program: 'Maintaince',
        number: 4,
    },{
        phase: 4,
        program: 'Weight gain',
        number: 4,
    },{
        phase: 4,
        program: 'Contest',
        number: 12,
    },]
    
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[0].phase}','${workoutsPerWeek[0].number}','${workoutsPerWeek[0].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[1].phase}','${workoutsPerWeek[1].number}','${workoutsPerWeek[1].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[2].phase}','${workoutsPerWeek[2].number}','${workoutsPerWeek[2].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[3].phase}','${workoutsPerWeek[3].number}','${workoutsPerWeek[3].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[4].phase}','${workoutsPerWeek[4].number}','${workoutsPerWeek[4].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[5].phase}','${workoutsPerWeek[5].number}','${workoutsPerWeek[5].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[6].phase}','${workoutsPerWeek[6].number}','${workoutsPerWeek[6].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[7].phase}','${workoutsPerWeek[7].number}','${workoutsPerWeek[7].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[8].phase}','${workoutsPerWeek[8].number}','${workoutsPerWeek[8].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[9].phase}','${workoutsPerWeek[9].number}','${workoutsPerWeek[9].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[10].phase}','${workoutsPerWeek[10].number}','${workoutsPerWeek[10].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[11].phase}','${workoutsPerWeek[11].number}','${workoutsPerWeek[11].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[12].phase}','${workoutsPerWeek[12].number}','${workoutsPerWeek[12].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[13].phase}','${workoutsPerWeek[13].number}','${workoutsPerWeek[13].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[14].phase}','${workoutsPerWeek[14].number}','${workoutsPerWeek[14].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[15].phase}','${workoutsPerWeek[15].number}','${workoutsPerWeek[15].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[16].phase}','${workoutsPerWeek[16].number}','${workoutsPerWeek[16].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[17].phase}','${workoutsPerWeek[17].number}','${workoutsPerWeek[17].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[18].phase}','${workoutsPerWeek[18].number}','${workoutsPerWeek[18].program}')`
    );
    await Database.raw(`
        INSERT INTO workouts_per_week (phase, number, program)
        VALUES('${workoutsPerWeek[19].phase}','${workoutsPerWeek[19].number}','${workoutsPerWeek[19].program}')`
    );
  }
}

module.exports = WorkoutsPerWeek;
