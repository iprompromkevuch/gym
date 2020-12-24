'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const ExerciseGroup = use('App/Models/ExerciseGroup');
const dumps    = use('App/Utils/dumps');

class Show {
    async execute(request, auth, response) {
        try {
            const groupId = request.params.id;
            const userId = auth.user.id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }
            
            const group = await ExerciseGroup.find(groupId);
            if (!group) {
                return response.status(400).json({ message: 'there is no group' });
            }

            const workout = await Workout.find(group.workout_id);
            if (!workout) {
                return response.status(400).json({ message: 'There is no workout' });
            }

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            const exercises = await Exercise.findByGroup(groupId, userId);

            return response.status(200).json({ 
                data : {
                    group : dumps.dumpExerciseGroup(group),
                    exercises : exercises
                        ? exercises.map((item) => dumps.dumpExercise(item))
                        : [],
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
  * /api/v1/exercise/group/{id}:
  *   get:
  *     tags:
  *       - Exercise Groups API
  *     security:
  *       - bearerAuth: []
  *     summary: show group by id with exercises
  *     parameters:
  *       - name        : id
  *         description : unique identifier of group
  *         in          : path
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example: {
                "data": {
                    "group": {
                        "id": 8,
                        "workout_id": 8,
                        "name": "sad"
                    },
                    "exercises": [
                    {
                        "id": 40,
                        "primary_muscle": "Legs",
                        "ability_level": "advanced",
                        "type": "wdsa",
                        "name": "asdsa",
                        "description": "wdasa",
                        "created_by": 1,
                        "is_system_default": false,
                        "is_favorite": false
                    },
                    {
                        "id": 41,
                        "primary_muscle": "Legs",
                        "ability_level": "beginner",
                        "type": "wdsa",
                        "name": "asdsa",
                        "description": "wdasa",
                        "created_by": 1,
                        "is_system_default": false,
                        "is_favorite": false
                    }
                    ]
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

module.exports = Show;