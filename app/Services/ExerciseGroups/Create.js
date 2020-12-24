'use strict'

const ExerciseGroup = use('App/Models/ExerciseGroup');
const User          = use('App/Models/User');
const Workout       = use('App/Models/Workout');
const dumps         = use('App/Utils/dumps');
const Database      = use('Database');

class Create {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = auth.user.id;
            const workoutId = input.workout_id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }
            
            const workout = await Workout.find(workoutId);
            if (!workout) {
                return response.status(400).json({ message: 'There is no workout' });
            }

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            const maxOrderNumber = await Database.raw(`
                Select max(exercise_groups.order) as max_order from exercise_groups
                Where workout_id = ${workout.id}
            `);

            const group = await ExerciseGroup.create({
                name       : input.name,
                workout_id : workoutId,
                order      : maxOrderNumber.rows[0].max_order + 1 || 1
            });

            return response.status(200).json({ 
                data : dumps.dumpExerciseGroup(group['$attributes'])
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/group:
  *   post:
  *     tags:
  *       - Exercise Groups API
  *     security:
  *       - bearerAuth: []
  *     summary: create group and assign to workout
  *     parameters:
  *       - name        : workout_id
  *         description : unique identifier of workout to which assign group
  *         in          : query
  *         required    : true
  *       - name        : name
  *         description : name of group
  *         in          : query
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example: {
                "data": {
                    "group": {
                    "id": 9,
                    "workout_id": "8",
                    "name": "happy"
                    }
                }
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

module.exports = Create;