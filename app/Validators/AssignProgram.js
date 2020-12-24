'use strict'
const { validate, rule, formatters } = use('Validator');

class AssignProgram {
    get rules() {
        return {
            program_id : 'required|integer',
            user_id : 'required|integer',
            company_id: 'required|integer'
        }
    }

    async fails (errorMessages) {
        return this.ctx.response.status(422).json(errorMessages)
    }

    get formatter () {
        return formatters.JsonApi
    }
}

module.exports = AssignProgram;
