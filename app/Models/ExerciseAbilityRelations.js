'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Database = use("Database");

class ExerciseAbilityRelations extends Model {
    static get table() {
        return 'exercise_ability_relations';
    }

}

module.exports = ExerciseAbilityRelations;