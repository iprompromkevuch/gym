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
    const nbCapiler16 = [{
        weight_from  : 81,
        weight_to    : 114,
        nb_capiler   : 75,
        weeks_count  : 16
    },{
        weight_from  : 66,
        weight_to    : 80,
        nb_capiler   : 100,
        weeks_count  : 16
    },{
        weight_from  : 56,
        weight_to    : 65,
        nb_capiler   : 125,
        weeks_count  : 16
    },{
        weight_from  : 51,
        weight_to    : 114,
        nb_capiler   : 150,
        weeks_count  : 16
    },{
        weight_from  : 41,
        weight_to    : 50,
        nb_capiler   : 175,
        weeks_count  : 16
    },{
        weight_from  : 33,
        weight_to    : 40,
        nb_capiler   : 200,
        weeks_count  : 16
    },{
        weight_from  : 23,
        weight_to    : 32,
        nb_capiler   : 250,
        weeks_count  : 16
    },{
        weight_from  : 19,
        weight_to    : 22,
        nb_capiler   : 300,
        weeks_count  : 16
    },{
        weight_from  : 15,
        weight_to    : 18,
        nb_capiler   : 350,
        weeks_count  : 16
    }];

    const nbCapiler32 = [{
        weight_from  : 211,
        weight_to    : 400,
        nb_capiler   : 50,
        weeks_count  : 32
    },{
        weight_from  : 151,
        weight_to    : 210,
        nb_capiler   : 75,
        weeks_count  : 32
    },{
        weight_from  : 131,
        weight_to    : 150,
        nb_capiler   : 100,
        weeks_count  : 32
    },{
        weight_from  : 121,
        weight_to    : 130,
        nb_capiler   : 125,
        weeks_count  : 32
    },{
        weight_from  : 86,
        weight_to    : 120,
        nb_capiler   : 150,
        weeks_count  : 32
    },{
        weight_from  : 76,
        weight_to    : 85,
        nb_capiler   : 175,
        weeks_count  : 32
    },{
        weight_from  : 66,
        weight_to    : 75,
        nb_capiler   : 200,
        weeks_count  : 32
    },{
        weight_from  : 55,
        weight_to    : 65,
        nb_capiler   : 250,
        weeks_count  : 32
    },{
        weight_from  : 40,
        weight_to    : 55,
        nb_capiler   : 300,
        weeks_count  : 32
    }];

    // 16
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[0].weight_from}, ${nbCapiler16[0].weight_to}, ${nbCapiler16[0].nb_capiler}, ${nbCapiler16[0].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[1].weight_from}, ${nbCapiler16[1].weight_to}, ${nbCapiler16[1].nb_capiler}, ${nbCapiler16[1].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[2].weight_from}, ${nbCapiler16[2].weight_to}, ${nbCapiler16[2].nb_capiler}, ${nbCapiler16[2].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[3].weight_from}, ${nbCapiler16[3].weight_to}, ${nbCapiler16[3].nb_capiler}, ${nbCapiler16[3].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[4].weight_from}, ${nbCapiler16[4].weight_to}, ${nbCapiler16[4].nb_capiler}, ${nbCapiler16[4].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[5].weight_from}, ${nbCapiler16[5].weight_to}, ${nbCapiler16[5].nb_capiler}, ${nbCapiler16[5].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[6].weight_from}, ${nbCapiler16[6].weight_to}, ${nbCapiler16[6].nb_capiler}, ${nbCapiler16[6].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[7].weight_from}, ${nbCapiler16[7].weight_to}, ${nbCapiler16[7].nb_capiler}, ${nbCapiler16[7].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler16[8].weight_from}, ${nbCapiler16[8].weight_to}, ${nbCapiler16[8].nb_capiler}, ${nbCapiler16[8].weeks_count})`
    );

    // 32
    
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[0].weight_from}, ${nbCapiler32[0].weight_to}, ${nbCapiler32[0].nb_capiler}, ${nbCapiler32[0].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[1].weight_from}, ${nbCapiler32[1].weight_to}, ${nbCapiler32[1].nb_capiler}, ${nbCapiler32[1].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[2].weight_from}, ${nbCapiler32[2].weight_to}, ${nbCapiler32[2].nb_capiler}, ${nbCapiler32[2].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[3].weight_from}, ${nbCapiler32[3].weight_to}, ${nbCapiler32[3].nb_capiler}, ${nbCapiler32[3].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[4].weight_from}, ${nbCapiler32[4].weight_to}, ${nbCapiler32[4].nb_capiler}, ${nbCapiler32[4].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[5].weight_from}, ${nbCapiler32[5].weight_to}, ${nbCapiler32[5].nb_capiler}, ${nbCapiler32[5].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[6].weight_from}, ${nbCapiler32[6].weight_to}, ${nbCapiler32[6].nb_capiler}, ${nbCapiler32[6].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[7].weight_from}, ${nbCapiler32[7].weight_to}, ${nbCapiler32[7].nb_capiler}, ${nbCapiler32[7].weeks_count})`
    );
    await Database.raw(`
        INSERT INTO nb_capiler_v1 (weight_from, weight_to, nb_capiler, weeks_count)
        VALUES(${nbCapiler32[8].weight_from}, ${nbCapiler32[8].weight_to}, ${nbCapiler32[8].nb_capiler}, ${nbCapiler32[8].weeks_count})`
    );
  }
}

module.exports = LeanFactorV1Seeder;
