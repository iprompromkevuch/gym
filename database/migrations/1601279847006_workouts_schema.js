'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WorkoutsSchema extends Schema {
  up () {
    this.table('workouts', (table) => {
      table.integer('created_by').notNullable()
      table.renameColumn('user_id', 'assigned_to')
      table.integer('company_id').notNullable()
      table.integer('role_id').notNullable()
    })
  }

  down () {
    this.table('workouts', (table) => {
      table.dropColumn('created_by')
      table.dropColumn('company_id')
      table.dropColumn('role_id')
      table.renameColumn('assigned_to', 'user_id')
    })
  }
}

module.exports = WorkoutsSchema
