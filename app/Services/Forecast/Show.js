'use strict'

const User     = use('App/Models/User');
const Forecast = use('App/Models/Forecast');
const dumps    = use('App/Utils/dumps');

class Show {
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
                return response.status(400).json({ message: 'There is no forecast' });
            }

            const doUserHasPermissions = await user.checkForecastPermissions(forecast, 'read');
            if (!doUserHasPermissions) {
                return response.status(403).json({ message: 'User has no permissions' });
            }

            return response.status(200).json({
                data : dumps.dumpForecast(forecast) 
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}

module.exports = Show;


/**
  * @swagger
  * /api/v1/forecast/{id}:
  *   get:
  *     tags:
  *       - Forecast API
  *     security:
  *       - bearerAuth: []
  *     summary: Show forecast
  *     parameters:
  *       - name        : id
  *         description : id of forcast you want to get
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
                    "owner_id": 1,
                    "name": "name",
                    "gender": "gender",
                    "goal_direction": "goal_direction",
                    "fitness_level": "fitness_level",
                    "term": "term",
                    "style": "style",
                    "rest": "rest",
                    "sequence": "sequence"
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
  *           response: [{
                "error": {
                    "message": "E_INVALID_JWT_TOKEN: jwt must be provided",
                    "name": "InvalidJwtToken",
                }
            }]
*/