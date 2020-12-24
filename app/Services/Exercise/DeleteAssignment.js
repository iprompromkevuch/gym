'use strict'
const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Database = use("Database");

class DeleteAssignment {
    async execute(request, auth, response) {
        try {
            const exerciseId = request.all().exercise_id;
            const workoutId = request.all().workout_id;
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const exercise = await Exercise.find(exerciseId);
            if (!exercise) {
                return response.status(400).json({ message: 'We dont have this exercise' });
            }
            
            const doUserHasPermissions = await user.checkExercisePermissions(exercise, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }
            
            await Database.raw(`
                delete from exercise_workout_relations
                where exercise_id = ${exerciseId} AND workout_id = ${workoutId}
            `);

            return response.status(201).json({ 
                message : 'Exercise assignment was successfully deleted' 
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}

/**
  * @swagger
  * /api/v1/exercise/assign/delete:
  *   delete:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: delete assignment of exercise to workout
  *     parameters:
  *       - name        : exercise_id
  *         description : unique identifier of exercise
  *         in          : query
  *         required    : true
  *       - name        : workout_id
  *         description : unique identifier of workout
  *         in          : query
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example:
  *             response: {
                    "message" : "Exercise assignment was successfully deleted" 
                }
  *       403:
  *         description: You try to reach resources you have no access
  *         example:
  *             response: {
                    "message": "User has no permissions"
                }
  *       401:
  *         description: Not authorized
  *         example:
  *           response: {
                "error": {
                    "message": "E_INVALID_JWT_TOKEN: jwt must be provided",
                    "name": "InvalidJwtToken",
                }
            }
*/

module.exports = DeleteAssignment;