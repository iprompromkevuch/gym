'use strict'

const Program  = use('App/Models/Program');
const User     = use('App/Models/User');
const Database = use('Database');

class DeleteAssign {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const userId = auth.user.id;
            const forecastId = input.forecast_id;
            const programId = input.program_id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const program = await Program.find(programId);
            if (!program) {
                return response.status(400).json({ message: 'We dont have this program' });
            }

            const doUserHasPermissions = await user.checkProgramPermissions(program, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            await Database.table('forecast_program_relations')
                .whereRaw('program_id = ? AND forecast_id = ?', [programId, forecastId])
                .delete();

            return response.status(200).json({ 
                message : "Assign to program was successfully deleted"
            });
        } catch (err) {
            console.log(err.stack, 'err')
            return response.status(500).json({ error : err })
        }
    }
}

module.exports = DeleteAssign;


/**
  * @swagger
  * /api/v1/forecast/delete-assign:
  *   post:
  *     tags:
  *       - Forecast API
  *     security:
  *       - bearerAuth: []
  *     summary: Delete assign of forecast to program
  *     parameters:
  *       - name        : program_id
  *         description : progrma
  *         in          : query
  *         required    : true
  *         type        : integer
  *       - name        : forecast_id
  *         description : forecast
  *         in          : query
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example:
  *           response: {
                "message": "Assign to program was successfully deleted"
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