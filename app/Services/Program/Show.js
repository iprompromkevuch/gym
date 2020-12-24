'use strict'

const Program = use('App/Models/Program');
const User    = use('App/Models/User');
const dumps   = use('App/Utils/dumps');

class Show {
    async execute(request, auth, response) {
        try {
            const programId = request.params.id;
            const userId = auth.user.id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const program = await Program.find(programId);
            if (!program) {
                return response.status(400).json({ message: 'We dont have this program' });
            }

            const doUserHasPermissions = await user.checkProgramPermissions(program, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }
            
            return response.status(200).json({
                data : dumps.dumpProgram(program) 
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


/**
  * @swagger
  * /api/v1/program/{id}:
  *   get:
  *     tags:
  *       - Program API
  *     security:
  *       - bearerAuth: []
  *     summary: Show program
  *     parameters:
  *       - name        : id
  *         description : id of program you want to get
  *         in          : path
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example:
  *           response: {
                "data": {
                    "trainer_id": 1,
                    "user_id": 2,
                    "status": 3,
                    "goal_direction": "input",
                    "start_date": "2020-12-11T22:00:00.000Z",
                    "term": 1,
                    "food_data": {
                        "data": "data"
                    },
                    "suppliments_data": {
                        "data": "data"
                    },
                    "workout_data": {
                        "data": "data"
                    },
                    "water_data": {
                        "data": "data"
                    },
                    "number_phases": 5
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