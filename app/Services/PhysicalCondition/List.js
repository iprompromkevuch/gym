'use strict'

const User     = use('App/Models/User');
const Database = use('Database');
const dump     = use('App/Utils/dumps');

class List {
    async execute(request, auth, response) {
        try {
            const user = await User.find(auth.user.id);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const client = await User.find(request.params.id);
            if (!client) {
                return response.status(400).json({ message: 'there are no this client' });
            }

            const doUserHasPermissions = await user.hasPhysicalConditionsPermissions('read', client);
            if (!doUserHasPermissions) {
                return response.status(403).json({ 'message' : 'You have no permissions' });
            }

            const physConditions = await Database.raw(`
                SELECT * FROM physical_conditions
                WHERE user_id = ${request.params.id}
                ORDER BY created_at DESC
            `);

            const result = physConditions.rows && physConditions.rows.length !== 0 ? 
                physConditions.rows : [];

            return response.status(200).json({ 
                data : result.map(item => dump.dumpPhysCondition(item)) 
            });
        } catch (err) {
            return response.status(500).json({ error : err })
        }
    }
}


  /**
  * @swagger
  * /api/v1/physical-condition/list/{id}:
  *   get:
  *     tags:
  *       - Physical condition API
  *     security:
  *       - bearerAuth: []
  *     summary: Get info of all physical conditions of user (for charts)
  *     parameters:
  *       - name: id
  *         description: id of client you want to see his measurements. If you have permissions, you will get ALL user physical conditions
  *         in: path
  *         required: true
  *     responses:
  *       200:
  *         description: Info of physical condition
  *         example:
  *           response: {
                "data": [
                    {
                        "user_id"          : 1,
                        "created_by"       : 2,
                        "weight"           : 100,
                        "tricep"           : 1.0,
                        "chest"            : 1.0,
                        "subscapular"      : 1.0,
                        "suprailiac"       : 1.0,
                        "abdominal"        : 1.0,
                        "midaxillary"      : 1.0,
                        "thigh"            : 1.0,
                        "total_body_fat_p" : 1.0,
                        "lean_mass"        : 1.0,
                        "arm_l"            : 1.0,
                        "arm_r"            : 1.0,
                        "thigh_l"          : 1.0,
                        "thigh_r"          : 1.0,
                        "calf_l"           : 1.0,
                        "calf_r"           : 1.0,
                        "neck"             : 1.0,
                        "waist"            : 1.0,
                        "hips"             : 1.0,
                        "additional_info"  : {"data" : "data"},
                        "created_at"       : "2020-10-06T12:57:20.000Z",
                        "updated_at"       : "2020-10-06T12:57:20.000Z"
                    }
                ]
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
   
module.exports = List;