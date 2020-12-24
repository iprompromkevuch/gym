'use strict'

const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const Database = use('Database');

class DeleteFavorite {
    async execute(request, auth, response) {
        try {
            const workoutId = request.params.id;
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const workout = await Workout.find(workoutId);
            if (!workout) {
                return response.status(400).json({ message: 'There is no workout' });
            }

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            await Database.raw(`
                DELETE from favorite_workouts
                where workout_id = ${workoutId} AND user_id = ${userId}
            `);

            return response.status(201).json({ 
                message : "Workout was successfully deleted from favorites"
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout/favorite/{id}:
  *   delete:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: delete workout from favorite
  *     parameters:
  *       - name        : id
  *         description : id of workout
  *         in          : path
  *         required    : true
  *         type        : string
  * 
  *     responses:
  *       201:
  *         description: success
  *         example: {
  *             "message" : "Workout was successfully deleted from favorites"
            }
  *       400:
  *         description: Not authorized
  *         example:
  *           response: {
                "error": {
                    "message": "There is no workout"
                }
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
  *       403:
  *         description: You try to reach resources you have no access
  *         example:
  *             response: {
                    "message": "User has no permissions"
                }
*/

module.exports = DeleteFavorite;