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


class LeanFactorV1Seeder {
  async run () {
    const leanFactorFemale = [{
        leanFactor  : 1,
        bodyFatFrom : 14,
        bodyFatTo   : 18,
        multiplier  : 0.95
    },{
        leanFactor  : 2,
        bodyFatFrom : 18,
        bodyFatTo   : 28,
        multiplier  : 0.90
    },{
        leanFactor  : 3,
        bodyFatFrom : 28,
        bodyFatTo   : 38,
        multiplier  : 0.85
    },{
        leanFactor  : 1,
        bodyFatFrom : 38,
        bodyFatTo   : 100,
        multiplier  : 0.8
    }];

    const leanFactorMale = [{
        leanFactor  : 1,
        bodyFatFrom : 1,
        bodyFatTo   : 6,
        multiplier  : 0.95
    },{
        leanFactor  : 2,
        bodyFatFrom : 6,
        bodyFatTo   : 12,
        multiplier  : 0.90
    },{
        leanFactor  : 3,
        bodyFatFrom : 12,
        bodyFatTo   : 20,
        multiplier  : 0.85
    },{
        leanFactor  : 1,
        bodyFatFrom : 21,
        bodyFatTo   : 100,
        multiplier  : 0.8
    }];

    // male
    await Database.raw(`
        INSERT INTO lean_factor_v1 (gender, lean_factor, body_fat_from, body_fat_to, multiplier)
        VALUES('male', ${leanFactorMale[0].leanFactor}, ${leanFactorMale[0].bodyFatFrom}, ${leanFactorMale[0].bodyFatTo}, ${leanFactorMale[0].multiplier})`
    );
    await Database.raw(`
        INSERT INTO lean_factor_v1 (gender, lean_factor, body_fat_from, body_fat_to, multiplier)
        VALUES('male', ${leanFactorMale[1].leanFactor}, ${leanFactorMale[1].bodyFatFrom}, ${leanFactorMale[1].bodyFatTo}, ${leanFactorMale[1].multiplier})`
    );
    await Database.raw(`
        INSERT INTO lean_factor_v1 (gender, lean_factor, body_fat_from, body_fat_to, multiplier)
        VALUES('male', ${leanFactorMale[2].leanFactor}, ${leanFactorMale[2].bodyFatFrom}, ${leanFactorMale[2].bodyFatTo}, ${leanFactorMale[2].multiplier})`
    );
    await Database.raw(`
        INSERT INTO lean_factor_v1 (gender, lean_factor, body_fat_from, body_fat_to, multiplier)
        VALUES('male', ${leanFactorMale[3].leanFactor}, ${leanFactorMale[3].bodyFatFrom}, ${leanFactorMale[3].bodyFatTo}, ${leanFactorMale[3].multiplier})`
    );
    
    // female
    await Database.raw(`
        INSERT INTO lean_factor_v1 (gender, lean_factor, body_fat_from, body_fat_to, multiplier)
        VALUES('female', ${leanFactorFemale[0].leanFactor}, ${leanFactorFemale[0].bodyFatFrom}, ${leanFactorFemale[0].bodyFatTo}, ${leanFactorFemale[0].multiplier})`
    );
    await Database.raw(`
        INSERT INTO lean_factor_v1 (gender, lean_factor, body_fat_from, body_fat_to, multiplier)
        VALUES('female', ${leanFactorFemale[1].leanFactor}, ${leanFactorFemale[1].bodyFatFrom}, ${leanFactorFemale[1].bodyFatTo}, ${leanFactorFemale[1].multiplier})`
    );
    await Database.raw(`
        INSERT INTO lean_factor_v1 (gender, lean_factor, body_fat_from, body_fat_to, multiplier)
        VALUES('female', ${leanFactorFemale[2].leanFactor}, ${leanFactorFemale[2].bodyFatFrom}, ${leanFactorFemale[2].bodyFatTo}, ${leanFactorFemale[2].multiplier})`
    );
    await Database.raw(`
        INSERT INTO lean_factor_v1 (gender, lean_factor, body_fat_from, body_fat_to, multiplier)
        VALUES('female', ${leanFactorFemale[3].leanFactor}, ${leanFactorFemale[3].bodyFatFrom}, ${leanFactorFemale[3].bodyFatTo}, ${leanFactorFemale[3].multiplier})`
    );
  }
}

module.exports = LeanFactorV1Seeder;
