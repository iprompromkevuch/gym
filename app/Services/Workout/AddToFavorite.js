'use strict'

const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const Database = use('Database');

class AddToFavorite {
    async execute(request, auth, response) {
        try {
            const data = request.all();
            const workoutId = data.workout_id;
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

            const favorite = await Database.table('favorite_workouts')
                .whereRaw('user_id = ? AND workout_id = ?', [userId, workoutId]);
            if (favorite.length !== 0) {
                return response.status(400).json({ 
                    message: 'this exercise has already in your favorites' 
                });
            }

            await Database.raw(`
                INSERT INTO favorite_workouts
                (workout_id, user_id)
                values (${workoutId}, ${userId})
            `);

            return response.status(201).json({ 
                message : "Workout was successfully added to favorites"
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout/favorite:
  *   post:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: add workout to favorite
  *     parameters:
  *       - name        : workout_id
  *         description : workout id
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: success
  *         example: {
                message : "Workout was successfully added to favorites"
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

module.exports = AddToFavorite;