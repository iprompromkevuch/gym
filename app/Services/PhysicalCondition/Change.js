'use strict'

const PhysicalCondition        = use('App/Models/PhysicalCondition');
const User                     = use('App/Models/User');
const Database                 = use('Database');
const dumps    = use('App/Utils/dumps');

class Change {
    async execute(request, auth, response) {
        try {
            /*
                1. find user and client
                2. check permissions of uwer to change client info
                3. calculate some
                4. find LATEST phys conditions of client
            */
            const physCondition = request.all();
            const userId = auth.user.id;

            const user = await User.find(auth.user.id);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const client = await User.find(request.params.id);
            if (!client) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const doUserHasPermissions = await user.hasPhysicalConditionsPermissions('write', client);
            if (!doUserHasPermissions) {
                return response.status(403).json({ 'message' : 'You have no permissions' });
            }

            const weight = physCondition.weight;
            const physConditions = {
                tricep      : +physCondition.tricep,
                chest       : +physCondition.chest,
                subscapular : +physCondition.subscapular,
                suprailiac  : +physCondition.suprailiac,
                abdominal   : +physCondition.abdominal,
                midaxillary : +physCondition.midaxillary,
                thigh       : +physCondition.thigh,
            }
            
            const isGenderValid = user.sex === 'male' || user.sex === 'female' ? true : false;
            if (!isGenderValid) {
                return response.status(400).json({ message : "this user do not have gender one of 'male' or 'female'" })
            }

            const total_body_fat_p = await PhysicalCondition.calculateBodyFatPercentage(user, physConditions);
            const lean_mass = await PhysicalCondition.calculateLeanMass(total_body_fat_p, weight);

            const additional_info = {
                created_by       : userId,
                additional_info  : JSON.stringify(physCondition.additional_info),
                arm_l            : physCondition.arm_l,
                arm_r            : physCondition.arm_r,
                thigh_l          : physCondition.thigh_l,
                thigh_r          : physCondition.thigh_r,
                calf_l           : physCondition.calf_l,
                calf_r           : physCondition.calf_r,
                neck             : physCondition.neck,
                waist            : physCondition.waist,
                hips             : physCondition.hips,
            }

            const setString = `
            created_by = ${additional_info.created_by},
            additional_info = json('${additional_info.additional_info}'),
            arm_l = ${additional_info.arm_l},
            arm_r = ${additional_info.arm_r},
            thigh_l = ${additional_info.thigh_l},
            thigh_r = ${additional_info.thigh_r},
            calf_l = ${additional_info.calf_l},
            calf_r = ${additional_info.calf_r},
            neck = ${additional_info.neck},
            waist = ${additional_info.waist},
            hips = ${additional_info.hips},
            tricep = ${physConditions.tricep},
            chest = ${physConditions.chest},
            subscapular = ${physConditions.subscapular},
            suprailiac = ${physConditions.suprailiac},
            abdominal = ${physConditions.abdominal},
            midaxillary = ${physConditions.midaxillary},
            thigh = ${physConditions.thigh},
            total_body_fat_p = ${total_body_fat_p},
            lean_mass = ${lean_mass},
            weight = ${weight}`;

            await Database.raw(`
                UPDATE physical_conditions 
                    SET ${setString}
                    Where id = (SELECT id from 
                        (SELECT id, created_at, user_id from physical_conditions
                            where user_id = ${request.params.id}
                            order by created_at DESC 
                            limit 1) as temp)
            `);

            const output = await Database.raw(`
                SELECT * FROM physical_conditions
                WHERE user_id = ${request.params.id}
                ORDER BY created_at DESC
                limit 1 
            `);

            const result = output.rows[0] ? output.rows[0] : null;
            return response.status(201).json({ 
                "data" : dumps.dumpPhysCondition(result)
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json(err)
        }
    }
}


    /**
  * @swagger
  * /api/v1/physical-condition/{id}:
  *   put:
  *     tags:
  *       - Physical condition API
  *     security:
  *       - bearerAuth: []
  *     summary: Change LATEST user phys conditions. This endpoint changes data of latest user phys condition BUT NOT ADDS NEW PHYS CONDITION. To Add new item -> use post endpoint and see result in charts
  *     parameters:
  *       - name        : id
  *         description : client, whose physical condition you are changing (search phys conditions by USER id)
  *         in          : path
  *         required    : true
  *         type        : integer
  *       - name        : weight
  *         description : client weight
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : tricep
  *         description : client tricep
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : chest
  *         description : client chest
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : tricep
  *         description : client tricep
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : subscapular
  *         description : client subscapular
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : suprailiac
  *         description : client suprailiac
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : abdominal
  *         description : client abdominal
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : midaxillary
  *         description : client midaxillary
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : thigh
  *         description : client thigh
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : arm_l
  *         description : client left arm
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : arm_r
  *         description : client right arm
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : thigh_l
  *         description : client left thigh
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : thigh_r
  *         description : client right thigh
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : calf_l
  *         description : client left calf
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : calf_r
  *         description : client right calf
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : neck
  *         description : client neck
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : waist
  *         description : client waist
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : hips
  *         description : client hips
  *         in          : query
  *         required    : true
  *         type        : number
  *         format      : float
  *       - name        : additional_info
  *         description : additional info in json
  *         in          : body
  *         required    : false
  *         type        : json
  *         schema      :
  *           type : object
  *           properties :
  *             additional_info :
  *               description : some data 
  *               type : object
  *               properties :
  *                 some :
  *                   type : string
  * 
  *     responses:
  *       200:
  *         description: Info of physical condition
  *         example:
  *           response: {
                "data": 
                    {
                        "message": "physical condition was successfully changed"
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

module.exports = Change;