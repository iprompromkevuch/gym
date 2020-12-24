'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Database = use("Database");

class AssignToWorkout {
    async execute(request, auth, response) {
        try {
            const data = request.all();
            const exerciseId = data.exercise_id;
            const workoutId = data.workout_id;
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
                INSERT INTO exercise_workout_relations
                (workout_id, exercise_id)
                values (${workoutId}, ${exerciseId})
            `)

            return response.status(201).json({ 
                message : 'Exercise was successfully assigned' 
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/assign:
  *   post:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: assign exercise to workout
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
                    "message" : "Exercise was successfully assigned" 
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

module.exports = AssignToWorkout;