'use strict'

const Program = use('App/Models/Program');
const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const WorkoutProgramAssign = use('App/Models/WorkoutProgramAssign');
const Database = use('Database')

class DeleteAssignment {
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

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }    

            await Database.raw(`
                delete from workout_program_relations
                where workout_id = ${workoutId}
                AND program_id = ${programId}
            `);

            return response.status(201).json({ 
                message : 'Workout assignment was successfully deleted' 
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout/assign/delete:
  *   delete:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: delete assignment of workout to program
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
  *       201:
  *         description: Success
  *         example:
  *             response: {
                    "message" : "Workout assignment was successfully deleted" 
                }
  *       400:
  *         description: Not authorized
  *         example:
  *           response: {
                "error": {
                    "message": "There is no workout"
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

module.exports = DeleteAssignment;