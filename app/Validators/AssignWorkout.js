'use strict'
const { validate, rule, formatters } = use('Validator')

class AssignWorkout {
  get rules() {
    return {
        program_id : 'required|integer',
        workout_id : 'required|integer'
    }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = AssignWorkout;
