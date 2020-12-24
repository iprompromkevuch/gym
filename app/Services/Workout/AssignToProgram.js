'use strict'

const Program = use('App/Models/Program');
const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const Database = use('Database');
const WorkoutProgramAssign = use('App/Models/WorkoutProgramAssign');

class AssignToProgram {
    async execute(request, auth, response) {
        try {
            const data = request.all();
            const userId = auth.user.id;
            const workoutId = data.workout_id;
            const programId = data.program_id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const workout = await Workout.find(workoutId);
            if (!workout) {
                return response.status(400).json({ message: 'Workout doesnt exist' });
            }

            const isAssignedToProgram = await workout.isAssignedToProgram();
            if (isAssignedToProgram) {
                return response.status(400).json({ 
                    message: 'Workout is already assigned to a program' 
                });
            }
            
            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }    

            await Database.raw(`
                INSERT INTO workout_program_relations
                (workout_id, program_id)
                values (${workoutId}, ${programId})
            `);

            return response.status(201).json({ 
                message : 'Workout was successfully assigned to program' 
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout/assign:
  *   post:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: assign workout to program
  *     parameters:
  *       - name        : program_id
  *         description : unique identifier of program
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
                    "message" : "Workout was successfully assigned" 
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
  *       422:
  *         description: validation
  *         example: {
  *             "errors": [
                    {
                        "title": "in",
                        "detail": "in validation failed on filters.0.field",
                        "source": {
                            "pointer": "filters.0.field"
                        }
                    }
                ]
            }
*/

module.exports = AssignToProgram;