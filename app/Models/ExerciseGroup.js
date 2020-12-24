'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Database = use('Database');


class ExerciseGroup extends Model {
    static get table () {
        return 'exercise_groups';
    }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }
}

module.exports = ExerciseGroup;
