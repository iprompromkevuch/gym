'use strict'
const Database = use('Database');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** 
*  @swagger
*  definitions:
*    Muscle:
*      type: object
*      properties:
*        id:
*          type: uint
*        primary_muscle:
*          type: string
*        
*      required:
*        - primary_muscle
*/

class Muscle extends Model {
    static get table () {
        return 'muscles';
    }
}

module.exports = Muscle