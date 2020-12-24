'use strict'

const User       = use('App/Models/User');
const Forecast   = use('App/Models/Forecast');
const dumps      = use('App/Utils/dumps');
const pagination = use('App/Utils/pagination');

class List {
    async execute(request, auth, response) {
        try {
            const input = request.all();
            const limit = parseInt(input.limit, 10);
            const page  = parseInt(input.page, 10) - 1;
            const userId = auth.user.id;
            
            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }
            
            const forecasts = await Forecast.findAvailable(user, limit, page);

            return response.status(200).json({
                data : forecasts.data
                    ? forecasts.data.map((item) => dumps.dumpForecast(item))
                    : forecasts.map((item) => dumps.dumpForecast(item)),
                pagination : pagination(forecasts, limit, page)
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}

module.exports = List;


/**
  * @swagger
  * /api/v1/forecast?limit={limit}&page={page}:
  *   get:
  *     tags:
  *       - Forecast API
  *     security:
  *       - bearerAuth: []
  *     summary: Show forecast
  *     parameters:
  *       - name        : limit
  *         description : how many items you want to see
  *         in          : path
  *         required    : true
  *         type        : integer
  *       - name        : page
  *         description : count of items you want to skip (limit * page) from 1
  *         in          : path
  *         required    : true
  *         type        : integer
  * 
  *     responses:
  *       200:
  *         description: Success
  *         example: {
                "data": [
                    {
                    "id": 9,
                    "created_by": 2,
                    "company_id": 2,
                    "name": "2",
                    "gender": "2",
                    "goal_direction": "2",
                    "fitness_level": "2",
                    "term": "2",
                    "style": "2",
                    "rest": "2",
                    "sequence": "2",
                    "is_system_default": false
                    },
                    {
                    "id": 10,
                    "created_by": 2,
                    "company_id": 2,
                    "name": "2",
                    "gender": "male",
                    "goal_direction": "2",
                    "fitness_level": "2",
                    "term": "2",
                    "style": "2",
                    "rest": "2",
                    "sequence": "2",
                    "is_system_default": false
                    }
                ],
                "pagination": {
                    "total": 2,
                    "perPage": 2,
                    "page": 1,
                    "lastPage": 2
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
*/