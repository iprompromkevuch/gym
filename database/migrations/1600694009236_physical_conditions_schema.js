'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhysicalConditionsSchema extends Schema {
  up () {
    this.create('physical_conditions', (table) => {
      table.increments()
      table.integer('user_id')
      table.integer('created_by')
      table.float('weight', 3, 2)
      table.float('tricep', 5, 3)
      table.float('chest', 5, 3)
      table.float('subscapular', 5, 3)
      table.float('suprailiac', 5, 3)
      table.float('abdominal', 5, 3)
      table.float('midaxillary', 5, 3)
      table.float('tigh', 5, 3)
      table.float('total_body_fat_p', 5, 3)
      table.float('lean_mass', 5, 3)
      table.float('arm_l', 5, 3)
      table.float('arm_r', 5, 3)
      table.float('tights_l', 5, 3)
      table.float('tights_r', 5, 3)
      table.float('calf_l', 5, 3)
      table.float('calf_r', 5, 3)
      table.float('neck', 5, 3)
      table.float('waist', 5, 3)
      table.float('hips', 5, 3)
      table.json('additional_info')
      table.timestamps()
    })
  }

  down () {
    this.drop('physical_conditions')
  }
}

module.exports = PhysicalConditionsSchema
