'use strict'

/*
|--------------------------------------------------------------------------
| MuscleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Muscle = use('App/Models/Muscle');

class MuscleSeeder {
  static muscleTypes = [
    'Legs',
    'Arms',
    'Shoulders',
    'Back',
    'Chest',
    'Cardio'
  ];

  async run () {
      await Muscle.create({ primary_muscle : 'Legs' });
      await Muscle.create({ primary_muscle : 'Arms' });
      await Muscle.create({ primary_muscle : 'Shoulders' });
      await Muscle.create({ primary_muscle : 'Back' });
      await Muscle.create({ primary_muscle : 'Chest' });
      await Muscle.create({ primary_muscle : 'Cardio' });
  }
}

module.exports = MuscleSeeder
