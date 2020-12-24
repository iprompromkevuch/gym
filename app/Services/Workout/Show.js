'use strict'

const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const dumps    = use('App/Utils/dumps');
const Database = use('Database');

class Show {
    async execute(request, auth, response) {
        try {
            const workoutId = request.params.id;
            const userId = auth.user.id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }
            
            const workout = await Workout.findWithFavorite(workoutId, user.id);
            if (!workout) {
                return response.status(400).json({ message: 'Workout doesnt exist' });
            }

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            const exercises = await Workout.getExercises(workout.id, user.id);
            const groups = await Database.raw(`
                SELECT * FROM exercise_groups
                where workout_id = ${workoutId}
            `);

            return response.status(200).json({ 
                data : {
                    workout   : dumps.dumpWorkout(workout),
                    exercises : exercises ? exercises.map((item) => dumps.dumpExercise(item)) : [],
                    groups : groups.rows ? groups.rows.map((item) => dumps.dumpExerciseGroup(item)) : [],
                }
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout/{id}:
  *   get:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: show workout info
  *     parameters:
  *       - name        : id
  *         description : id of workout you want to see
  *         in          : path
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: success
  *         example: {
                "data": {
                    "workout": {
                        "id": 9,
                        "created_by": 1,
                        "name": "name",
                        "description": "des",
                        "activity_level": "sada",
                        "type": "dsasaf",
                        "company_id": 2,
                        "is_system_default": false
                    },
                    "exercises": [],
                    "groups": []
                }
            }
  *       400:
  *         description: Not authorized
  *         example:
  *           response: {
                "error": {
                    "message": "Workout doesnt exist"
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

module.exports = Show;