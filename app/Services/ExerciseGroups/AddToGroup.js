'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const Database = use('Database');
const dumps    = use('App/Utils/dumps');
const ExerciseGroup = use('App/Models/ExerciseGroup');
const ExerciseGroupItem = use('App/Models/ExerciseGroupItem');

class AddToGroup {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const groupId = input.group_id;
            const exerciseId = input.exercise_id;
            const userId = auth.user.id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const exercise = await Exercise.find(exerciseId);
            if (!exercise) {
                return response.status(400).json({ message: 'there is no exercise' });
            }

            const group = await ExerciseGroup.find(groupId);
            if (!group) {
                return response.status(400).json({ message: 'there is no group' });
            }

            const workout = await Workout.find(group.workout_id);
            if (!workout) {
                return response.status(400).json({ message: 'There is no workout' });
            }

            const doUserHasPermissions = await user.checkWorkoutPermissions(workout, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            const maxOrderNumber = await Database.raw(`
                Select max(exercise_groups_items.order) as max_order from exercise_groups_items
                Where group_id = ${group.id}
            `);

            await ExerciseGroupItem.create({
                exercise_id : exerciseId,
                group_id    : groupId,
                order       : maxOrderNumber.rows[0].max_order + 1 || 1
            });
            
            return response.status(200).json({ 
                message : "Exercise was successfully added to group"
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/exercise/group/item:
  *   post:
  *     tags:
  *       - Exercise Groups API
  *     security:
  *       - bearerAuth: []
  *     summary: add exercise to group
  *     parameters:
  *       - name        : exercise_id
  *         description : unique identifier of exercise
  *         in          : query
  *         required    : true
  *       - name        : group_id
  *         description : unique identifier of group
  *         in          : query
  *         required    : true
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example: {
                "message" : "Exercise was successfully added to group"
            }
  *       403:
  *         description: You try to reach resources you have no access
  *         example: {
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

module.exports = AddToGroup;