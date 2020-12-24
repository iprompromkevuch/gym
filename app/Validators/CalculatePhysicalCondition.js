'use strict'
const { validate, rule, formatters } = use('Validator');

class CreatePhysicalCondition {
    get rules() {
        return {
            weight           : 'required|number|max:10|min:1',
            tricep           : 'required|number|max:10|min:1',
            chest            : 'required|number|max:10|min:1',
            subscapular      : 'required|number|max:10|min:1',
            suprailiac       : 'required|number|max:10|min:1',
            abdominal        : 'required|number|max:10|min:1',
            midaxillary      : 'required|number|max:10|min:1',
            age              : 'required|integer',
            gender           : 'required|string|in:male,female'
        }
    }

    async fails (errorMessages) {
        return this.ctx.response.status(422).json(errorMessages)
    }

    get formatter () {
        return formatters.JsonApi
    }
}

module.exports = CreatePhysicalCondition;
