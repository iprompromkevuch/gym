'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Database = use("Database");

class WorkoutProgramAssign extends Model {
    static get table() {
        return 'workout_program_relations';
    }

}

module.exports = WorkoutProgramAssign;