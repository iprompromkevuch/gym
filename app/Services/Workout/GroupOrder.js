'use strict'

const User     = use('App/Models/User');
const Workout  = use('App/Models/Workout');
const Database = use('Database');
const dumps    = use('App/Utils/dumps');
class GroupOrder {
    async execute(request, auth, response) {
        try {
            const workoutId = request.params.id;
            const userId = auth.user.id;
            const input = request.all();
            const groupIdsArray = input.group_ids;
            
            if (groupIdsArray.length <= 0 || groupIdsArray.length !== new Set(groupIdsArray).size) {
                return response.status(400).json({ message : "Wrong group ids count or group id value" });
            }            

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

            let isValidInputArray = true;
            const workoutGroups = await Workout.getWorkoutGroups(workoutId);

            if (workoutGroups.length !== groupIdsArray.length) {
                isValidInputArray = false;
            } else {
                workoutGroups.forEach(item => {
                    if (!groupIdsArray.includes(item.id)) {
                        isValidInputArray = false;
                    }
                });
            }

            if (!isValidInputArray) {
                return response.status(400).json({ message : "Wrong group ids count or group id value" });
            }

            const valuesToSql = workoutGroups.map((item, index) => {
                return `(${groupIdsArray[index]}, '${item.name}', ${item.workout_id}, ${index + 1})`;
            }).join(',');

            await Database.raw(`
                INSERT INTO exercise_groups (id, name, workout_id, "order") 
                VALUES ${valuesToSql}
                ON CONFLICT (id) DO UPDATE 
                    SET "order" = excluded.order
            `);

            const workoutUpdatedGroups = await Workout.getWorkoutGroups(workoutId);

            return response.status(201).json({ 
                data : workoutUpdatedGroups.map(item => dumps.dumpExerciseGroup(item))
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/workout/{id}/group/order:
  *   put:
  *     tags:
  *       - Workout API
  *     security:
  *       - bearerAuth: []
  *     summary: change groups order
  *     parameters:
  *       - name        : id
  *         description : id of workout
  *         in          : path
  *         required    : true
  *         type        : string
  *       - name        : group_ids
  *         description : ids of groups in right order
  *         in          : body
  *         required    : true
  *         schema      :
  *           type: object
  *           properties:
  *             group_ids:
  *               type: array
  *               description: some
  *               items:
  *                 type: integer
  *               uniqueItems: true
  * 
  *     responses:
  *       201:
  *         description: success
  *         example: {
                "data": [
                    {
                    "id": 2,
                    "workout_id": 1,
                    "name": "sda",
                    "order": 1
                    }
                ]
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

module.exports = GroupOrder;