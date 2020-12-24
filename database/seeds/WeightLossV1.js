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
        // phase 1

        // 110	0.045	0.0014
        // 135	0.08	0.0014
        // 185	0.15	0.00375
        // 225	0.3	0.003333333333
        // 255	0.4	0.002857142857
        // 290	0.5	0.00125
        // 330	0.55	0.002
        // 355	0.6	0.002
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(1, 110, 0.045, 0.0014)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(1, 135, 0.08, 0.0014)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(1, 185, 0.15, 0.00375)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(1, 225, 0.3, 0.003333333333)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(1, 255, 0.4, 0.002857142857)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(1, 290, 0.5, 0.00125)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(1, 330, 0.55, 0.002)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(1, 355, 0.6, 0.002)`);
    
        // phase 2

        // 110	-0.08953488372	0.004186046512
        // 129	-0.01	0.004186046512
        // 172	0.17	0.002777777778
        // 208	0.27	0.00375
        // 248	0.42	0.001212121212
        // 281	0.46	0.0021875
        // 313	0.53	0.001428571429
        // 348	0.58	0.002
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(2, 110, -0.08953488372, 0.004186046512)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(2, 129, -0.01, 0.004186046512)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(2, 172, 0.17, 0.002777777778)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(2, 208, 0.27, 0.00375)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(2, 248, 0.42, 0.001212121212)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(2, 281, 0.46, 0.0021875)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(2, 313, 0.53, 0.001428571429)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(2, 348, 0.58, 0.002)`);

        // phase 3

        // 110	0.01714285714	0.005238095238
        // 122	0.08	0.005238095238
        // 164	0.3	0.001818181818
        // 197	0.36	0.002727272727
        // 241	0.48	0.0005714285714
        // 276	0.5	0.00275862069
        // 305	0.58	0.001428571429
        // 340	0.63	0.002
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(3, 110, 0.01714285714, 0.005238095238)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(3, 122, 0.08, 0.005238095238)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(3, 164, 0.3, 0.001818181818)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(3, 197, 0.36, 0.002727272727)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(3, 241, 0.48, 0.0005714285714)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(3, 276, 0.5, 0.00275862069)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(3, 305, 0.58, 0.001428571429)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(3, 340, 0.63, 0.002)`);

        // phase 4

        // 110	-0.04	0.005
        // 120	0.01	0.005
        // 148	0.15	0.005882352941
        // 182	0.35	0.0009259259259
        // 236	0.4	0.001176470588
        // 270	0.44	0.002903225806
        // 301	0.53	0.002
        // 336	0.6	0.002
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(4, 110, -0.04, 0.005)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(4, 120, 0.01, 0.005)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(4, 148, 0.15, 0.005882352941)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(4, 182, 0.35, 0.0009259259259)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(4, 236, 0.4, 0.001176470588)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(4, 270, 0.44, 0.002903225806)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(4, 301, 0.53, 0.002)`);
    await Database.raw(`
        INSERT INTO weight_loss_v1 (phase_number, weight, weight_loss_ratio, increment)
        VALUES(4, 336, 0.6, 0.002)`);
  }
}

module.exports = WeightLossV1Seeder;
