'use strict'

const User             = use('App/Models/User');
const Exercise         = use('App/Models/Exercise');
const ExerciseFavorite = use('App/Models/ExerciseFavorite');
const Database         = use('Database');

class Create {
    async execute(request, auth, response) {
        try {
            const data = request.all();
            const exerciseId = data.exercise_id;
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there is no user' });
            }

            const exercise = await Exercise.find(exerciseId);
            if (!exercise) {
                return response.status(400).json({ message: 'this exercise doesnt exist' });
            }

            const doUserHasPermissions = await user.checkExercisePermissions(exercise, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }
            
            const favorite = await Database.table('favorite_exercises')
                .whereRaw('user_id = ? AND exercise_id = ?', [userId, exerciseId]);
            if (favorite.length !== 0) {
                return response.status(400).json({ 
                    message: 'this exercise has already in your favorites' 
                });
            }

            await Database.raw(`
                INSERT INTO favorite_exercises (user_id, exercise_id)
                Values (${userId}, ${exerciseId})
            `)

            return response.status(201).json({ 
                message : `Exercise ${exerciseId} was successfully added to favorites`
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err });
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/favorite:
  *   post:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: add exercises to favorite
  *     parameters:
  *       - name        : exercise_id
  *         description : which exercise add to favorite
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       201:
  *         description: success
  *         example:
  *           response: {
                "message" : "Exercise was successfully added to favorites"
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