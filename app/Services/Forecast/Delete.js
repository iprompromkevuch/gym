'use strict'

const Exercise = use('App/Models/Exercise');
const User     = use('App/Models/User');
const Database = use('Database');
const Forecast = use('App/Models/Forecast');

class Delete {
    async execute(request, auth, response) {
        try {
            const forecastId = request.params.id;
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const forecast = await Forecast.find(forecastId);
            if (!forecast) {
                return response.status(400).json({ message: 'forecast doesnt exist' });
            }

            const count = await forecast.isAssignedToProgram();
            if (count !== '0') {
                return response.status(400).json({ 
                    message: 'This forecast is assigned program' 
                });
            }
            
            const doUserHasPermissions = await user.checkForecastPermissions(forecast, 'write');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }
            
            await forecast.delete();

            return response.status(200).json({ 
                message : 'forecast was successfully deleted' 
            });
        } catch (err) {
            console.log(err)
            return response.status(500).json({ error : err })
        }
    }
}

module.exports = Delete;


/**
  * @swagger
  * /api/v1/forecast/{id}:
  *   delete:
  *     tags:
  *       - Forecast API
  *     security:
  *       - bearerAuth: []
  *     summary: delete forecast
  *     parameters:
  *       - name        : id
  *         description : id of forcast you want to delete
  *         in          : path
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example:
  *           response: {
                "message" : "Forecast was successfully deleted"
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