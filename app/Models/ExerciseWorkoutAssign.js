'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Database = use("Database");

class ExerciseWorkoutAssign extends Model {
    static get table() {
        return 'exercise_workout_relations';
    }
}

module.exports = ExerciseWorkoutAssign;