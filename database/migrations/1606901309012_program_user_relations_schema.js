'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramUserRelationsSchema extends Schema {
  up () {
    this.create('program_user_relations', (table) => {
      table.increments('id')
      .unsigned()
      .notNullable()
      .primary();

      table.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE')

      table.integer('program_id')
      .unsigned()
      .references('id')
      .inTable('programs')
      .notNullable()
      .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('program_user_relations')
  }
}

module.exports = ProgramUserRelationsSchema
