'use strict'
const Database = use('Database');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** 
*  @swagger
*  definitions:
*    Ability:
*      type: object
*      properties:
*        id:
*          type: uint
*        ablility_level:
*          type: string
*        
*      required:
*        - ablility_level
*/

class Ability extends Model {
    static get table () {
        return 'abilities';
    }
}

module.exports = Ability;