'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** 
*  @swagger
*  definitions:
*    ExerciseFavorite:
*      type: object
*      properties:     
*        user_id:
*           type: int
*        exercise_id:
*           type: int
*        
*      required:
*        - user_id
*        - exercise_id
*/

class ExerciseFavorite extends Model {
   static get table () {
        return 'favorite_exercises';
    }
}

module.exports = ExerciseFavorite;
