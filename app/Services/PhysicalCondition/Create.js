'use strict'

const PhysicalCondition = use('App/Models/PhysicalCondition');
const User              = use('App/Models/User');
const dumps    = use('App/Utils/dumps');

class Create {
    async execute(request, auth, response) {
        try {
            const physCondition = request.all();
            const userId = auth.user.id;

            const user = await User.find(userId);
            if (!user) {
                return response.status(400).json({ message: 'there are no user' });
            }

            const client = await User.find(physCondition.user_id);
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
                user_id          : physCondition.user_id,
                additional_info  : physCondition.additional_info || null,
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

            const result = await PhysicalCondition.create({
                ...physConditions, 
                ...additional_info, 
                total_body_fat_p,
                lean_mass,
                weight
            });
    
            return response.status(201).json({
                "data" : dumps.dumpPhysCondition(result)
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ error : err })
        }
    }
}


  /**
  * @swagger
  * /api/v1/physical-condition:
  *   post:
  *     tags:
  *       - Physical condition API
  *     security:
  *       - bearerAuth: []
  *     summary: create phys conditions by post even if this user already has it. But it will be latest actual info. Phys conditions will be shown in separate endpoints for charts with others, that were created earlier
  *     parameters:
  *       - name        : user_id
  *         description : client, whose physical condition you are creating
  *         in          : query
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
  * 
  *     responses:
  *         201:
*               description: Info of physical condition
*               example: {
                    "data": {
                        "id": 13,
                        "user_id": "2",
                        "weight": "2",
                        "tricep": 2,
                        "chest": 2,
                        "subscapular": 2,
                        "suprailiac": 2,
                        "abdominal": 2,
                        "midaxillary": 2,
                        "thigh": 2,
                        "total_body_fat_p": 4.92,
                        "lean_mass": 1.9016,
                        "arm_l": "2",
                        "arm_r": "2",
                        "thigh_l": "2",
                        "thigh_r": "2",
                        "calf_l": "2",
                        "calf_r": "2",
                        "neck": "2",
                        "waist": "2",
                        "hips": "2",
                        "additional_info": {},
                        "created_at": "2020-10-13 13:54:51",
                        "updated_at": "2020-10-13 13:54:51"
                    }
                }
  *         400:
*               description: Physical condition already exists
*               example:
*                   response: {
                                "message": "Physical condition for this user already created"
                            }
  *         401:
  *           description: Not authorized
  *           example:
  *             response: {
                    "error": {
                        "message": "E_INVALID_JWT_TOKEN: jwt must be provided",
                        "name": "InvalidJwtToken",
                    }
                }
  *         422:
  *           description: validation
  *           example: 
  *             "errors": [
                    {
                        "title": "in",
                        "detail": "in validation failed on filters.0.field",
                        "source": {
                            "pointer": "filters.0.field"
                        }
                    }
                ]

    */
   
module.exports = Create;