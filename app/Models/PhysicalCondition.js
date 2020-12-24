'use strict'
const Database = use('Database');
const moment = require('moment');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** 
*  @swagger
*  definitions:
*    PhysicalCondition:
*      type: object
*      properties:
*        id:
*          type: uint
*        user_id:
*          type: uint
*        created_by:
*          type: uint
*        weight:
*          type: float
*        tricep:
*          type: float
*        chest:
*          type: float
*        subscapular:
*          type: float
*        suprailiac:
*          type: float
*        abdominal:
*          type: float
*        midaxillary:
*          type: float
*        thigh:
*          type: float
*        total_body_fat_p:
*          type: float
*        lean_mass:
*          type: float
*        arm_l:
*          type: float
*        arm_r:
*          type: float
*        thigh_l:
*          type: float
*        thigh_r:
*          type: float
*        calf_l:
*          type: float
*        calf_r:
*          type: float
*        neck:
*          type: float
*        waist:
*          type: float
*        hips:
*          type: float
*        additional_info:
*          type: json
*      required:
*        - user_id
*        - created_by      
*        - weight          
*        - tricep          
*        - chest           
*        - subscapular     
*        - suprailiac      
*        - abdominal       
*        - midaxillary     
*        - thigh            
*        - total_body_fat_p
*        - lean_mass       
*        - arm_l           
*        - arm_r           
*        - thigh_l        
*        - thigh_r        
*        - calf_l          
*        - calf_r          
*        - neck            
*        - waist           
*        - hips            
*/

class PhysicalCondition extends Model {
    static HAVE_READ_PERMISSIONS = ['admin', 'manager', 'owner', 'trainer'];
    static HAVE_WRITE_PERMISSIONS = ['manager', 'owner', 'trainer'];
    static CONST_MEASUREMENTS_STEP_A_MALE   = 0.00043499;
    static CONST_MEASUREMENTS_STEP_A_FEMALE = 0.00046971;
    static CONST_MEASUREMENTS_STEP_D_MALE   = 0.00000055;
    static CONST_MEASUREMENTS_STEP_D_FEMALE = 0.00000056;
    static CONST_MEASUREMENTS_STEP_E_MALE   = 0.00028826;
    static CONST_MEASUREMENTS_STEP_E_FEMALE = 0.00012828;
    static CONST_MEASUREMENTS_STEP_G_MALE   = 1.112;
    static CONST_MEASUREMENTS_STEP_G_FEMALE = 1.097;

    static get table () {
        return 'physical_conditions';
    }

    users() {
        return this.belongsTo('App/Models/User', 'id', 'user_id')
    }

    static async calculateBodyFatPercentage(user, measurements) {
        // doc* variables are steps from documentation how to calculate body fat
        const docA = Object.values(measurements).reduce((accumulator, currentValue) => accumulator + currentValue);  
        const docB = docA * (user.sex === 'male' ? this.CONST_MEASUREMENTS_STEP_A_MALE : this.CONST_MEASUREMENTS_STEP_A_FEMALE);        
        const docC = docA**2;        
        const docD = docC * (user.sex === 'male' ? this.CONST_MEASUREMENTS_STEP_D_MALE : this.CONST_MEASUREMENTS_STEP_D_FEMALE);        
        const docE = moment().diff(user.birthdate, 'years') * (user.sex === 'male' ? 
            this.CONST_MEASUREMENTS_STEP_E_MALE : this.CONST_MEASUREMENTS_STEP_E_FEMALE);        
        const docF = docD - docE;        
        const docG = (user.sex === 'male' ? this.CONST_MEASUREMENTS_STEP_G_MALE : this.CONST_MEASUREMENTS_STEP_G_FEMALE) - docB + docF;
        const bodyFat = +(((4.95 / docG) - 4.5) * 100).toFixed(2);

        return bodyFat || 0;
    }

    static async calculateBodyFatPercentageWithAge(user, measurements, age, gender) {
        // doc* variables are steps from documentation how to calculate body fat
        const docA = Object.values(measurements).reduce((accumulator, currentValue) => accumulator + currentValue);  
        const docB = docA * (gender === 'male' ? this.CONST_MEASUREMENTS_STEP_A_MALE : this.CONST_MEASUREMENTS_STEP_A_FEMALE);        
        const docC = docA**2;        
        const docD = docC * (gender === 'male' ? this.CONST_MEASUREMENTS_STEP_D_MALE : this.CONST_MEASUREMENTS_STEP_D_FEMALE);        
        const docE = age * (gender === 'male' ? this.CONST_MEASUREMENTS_STEP_E_MALE : this.CONST_MEASUREMENTS_STEP_E_FEMALE);        
        const docF = docD - docE;        
        const docG = (gender === 'male' ? this.CONST_MEASUREMENTS_STEP_G_MALE : this.CONST_MEASUREMENTS_STEP_G_FEMALE) - docB + docF;
        const bodyFat = +(((4.95 / docG) - 4.5) * 100).toFixed(2);

        return bodyFat || 0;
    }

    static async calculateLeanMass(bodyFat, userWeight) {
        return (1 - bodyFat/100) * userWeight;
    }
}

module.exports = PhysicalCondition