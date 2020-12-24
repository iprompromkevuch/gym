'use strict'

const User     = use('App/Models/User');
const Database = use('Database');

class List {
    async execute(request, auth, response) {
        try {
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const muscles = await Database.table('muscles').select('*');

            return response.status(201).json({ 
                data: muscles ? muscles : {}
            });
        } catch (err) {
            console.log(err.stack, 'err')
            return response.status(500).json({ error : err })
        }
    }
}

module.exports = List;


/**
  * @swagger
  * /api/v1/muscle:
  *   get:
  *     tags:
  *       - Muscle API
  *     security:
  *       - bearerAuth: []
  *     summary: Get muscles
  * 
  *     responses:
  *       201:
  *         description: Success
  *         example:
  *             response: {
                    "data": {
                            "id": 49,
                            "primary_muscle": "Cardio",
                            "ability_level": "intermediate",
                            "type": "sad",
                            "name": "ew",
                            "description": "2eds",
                            "created_by": 1,
                            "is_system_default": false,
                            "is_favorite": false
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
