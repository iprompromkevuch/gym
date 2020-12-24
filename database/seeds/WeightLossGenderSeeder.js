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


class WeightLossV1Seeder {
  async run () {
    await Database.raw(`
        Update weight_loss_v1
        Set gender='female'
        where gender is NULL
    `)

    // phase 1

    // 176	0.1084444444	0.002888888889
    // 180	0.12	0.002888888889
    // 225	0.25	0.001666666667
    // 255	0.3	0.003333333333
    // 285	0.4	0.001428571429
    // 320	0.45	0.001428571429
    // 355	0.5	0.002857142857
    // 390	0.6	0.002
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(1, 176, 0.1084444444, 0.002888888889, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(1, 180, 0.12, 0.002888888889, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(1, 225, 0.25, 0.001666666667, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(1, 255, 0.3, 0.003333333333, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(1, 285, 0.4, 0.001428571429, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(1, 320, 0.45, 0.001428571429, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(1, 355, 0.50, 0.002857142857, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(1, 390, 0.6, 0.002, 'male')`);
    
        // phase 2

        // 172	0.12	0.0008333333333
        // 172	0.12	0.0008333333333
        // 208	0.15	0.001612903226
        // 239	0.2	0.002857142857
        // 274	0.3	0.001315789474
        // 312	0.35	0.001388888889
        // 348	0.4	0.004347826087
        // 371	0.5	0.002
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(2, 172, 0.12, 0.0008333333333, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(2, 208, 0.15, 0.001612903226, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(2, 239, 0.2, 0.002857142857, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(2, 274, 0.3, 0.001315789474, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(2, 312, 0.35, 0.001388888889, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(2, 348, 0.4, 0.004347826087, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(2, 371, 0.5, 0.002, 'male')`);

        // phase 3

        // 168	0.1	0.001379310345
        // 168	0.1	0.001379310345
        // 197	0.14	0.001428571429
        // 225	0.18	0.0004545454545
        // 269	0.2	0.001388888889
        // 305	0.25	0.001428571429
        // 340	0.3	0.003225806452
        // 371	0.4	0.002
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(3, 168, 0.1, 0.001379310345, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(3, 197, 0.14, 0.001428571429, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(3, 225, 0.18, 0.0004545454545, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(3, 269, 0.2, 0.001388888889, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(3, 305, 0.25, 0.001428571429, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(3, 340, 0.3, 0.003225806452, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(3, 371, 0.4, 0.002, 'male')`);

        // phase 4

        // 161	0.02	0
        // 161	0.02	0
        // 182	0.02	0.0009090909091
        // 215	0.05	0.001162790698
        // 258	0.1	0.00125
        // 298	0.15	0.001315789474
        // 336	0.2	0.002857142857
        // 371	0.3	0.002
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(4, 161, 0.02, 0, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(4, 182, 0.02, 0.0009090909091, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(4, 215, 0.05, 0.001162790698, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(4, 258, 0.1, 0.00125, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(4, 298, 0.15, 0.001315789474, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(4, 336, 0.2, 0.002857142857, 'male')`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment, gender)
        VALUES(4, 371, 0.3, 0.002, 'male')`);
  }
}

module.exports = WeightLossV1Seeder;
