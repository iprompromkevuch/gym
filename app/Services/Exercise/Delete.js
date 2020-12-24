'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');

const Database = use('Database');

class Delete {
    async execute(request, auth, response) {
        try {
            const exerciseId = request.params.id;
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

            const isExerciseAssigned = await exercise.checkIfExerciseAssigned();
            if (isExerciseAssigned) {
                return response.status(400).json({ message: 'Exercise is currently assigned to user' });
            }

            // // delete workouts for this exercise
            // await Database.table('exercise_workout_relations')
            //     .where('exercise_id', exercise.id).delete();

            // // delete abilities for this exercise
            // await Database.table('exercise_ability_relations')
            //     .where('exercise_id', exercise.id).delete();

            // delete exercise
            await exercise.delete();

            return response.status(200).json({ message : 'Exercise was successfully deleted' });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}



/**
  * @swagger
  * /api/v1/exercise/{id}:
  *   delete:
  *     tags:
  *       - Exercise API
  *     security:
  *       - bearerAuth: []
  *     summary: Delete exercise
  *     parameters:
  *       - name        : id
  *         description : id of exercise
  *         in          : path
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example:
  *             response: {
                    "data": {
                            "message": "exercise was successfully deleted"
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

module.exports = Delete;