'use strict'

const Forecast = use('App/Models/Forecast');
const Program  = use('App/Models/Program');
const User     = use('App/Models/User');
const Database = use('Database');

class Assign {
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

            const forecast = await Forecast.find(forecastId);
            if (!forecast) {
                return response.status(400).json({ message: 'We dont have this forecast' });
            }

            const doUserHasPermissions = await user.checkProgramPermissions(program, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            const count = await forecast.isAssignedToProgram(programId);
            if (count !== '0') {
                return response.status(400).json({ 
                    message: 'This forecast is already assigned to this program' 
                });
            }
            
            await Database.table('forecast_program_relations').insert({
                program_id  : programId,
                forecast_id : forecastId
            });

            return response.status(201).json({ 
                message : "Forecast was successfully assigned to program"
            });
        } catch (err) {
            console.log(err.stack, 'err')
            return response.status(500).json({ error : err })
        }
    }
}

module.exports = Assign;


/**
  * @swagger
  * /api/v1/forecast/assign:
  *   post:
  *     tags:
  *       - Forecast API
  *     security:
  *       - bearerAuth: []
  *     summary: Assign forecast to program
  *     parameters:
  *       - name        : program_id
  *         description : program
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
                "message": "Forecast was successfully assigned to program"
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