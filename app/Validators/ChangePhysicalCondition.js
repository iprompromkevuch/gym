'use strict'
const { validate, rule, formatters } = use('Validator');

class ChangePhysicalCondition {
    get rules() {
        return {
            weight           : 'required|number|max:10|min:1',
            tricep           : 'required|number|max:10|min:1',
            chest            : 'required|number|max:10|min:1',
            subscapular      : 'required|number|max:10|min:1',
            suprailiac       : 'required|number|max:10|min:1',
            abdominal        : 'required|number|max:10|min:1',
            midaxillary      : 'required|number|max:10|min:1',
            thigh            : 'required|number|max:10|min:1',
            arm_l            : 'required|number|max:10|min:1',
            arm_r            : 'required|number|max:10|min:1',
            thigh_l          : 'required|number|max:10|min:1',
            thigh_r          : 'required|number|max:10|min:1',
            calf_l           : 'required|number|max:10|min:1',
            calf_r           : 'required|number|max:10|min:1',
            neck             : 'required|number|max:10|min:1',
            waist            : 'required|number|max:10|min:1',
            hips             : 'required|number|max:10|min:1', 
            additional_info  : 'object',
        }
    }

    async fails (errorMessages) {
        return this.ctx.response.status(422).json(errorMessages)
    }

    get formatter () {
        return formatters.JsonApi
    }
}

module.exports = ChangePhysicalCondition;
