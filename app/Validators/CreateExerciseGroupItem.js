'use strict'
const { validate, rule, formatters } = use('Validator')

class CreateExerciseGroup {
  get rules() {
      return {
        group_id    : 'required|integer',
        exercise_id : 'required|integer'
      }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = CreateExerciseGroup;
