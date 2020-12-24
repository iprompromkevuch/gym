'use strict'
const { validate, rule, formatters } = use('Validator')

class ChangeExerciseOrder {
  get rules() {
      return {
        "exercise_ids"   : "required",
        "exercise_ids.*" : "required|integer"
      }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = ChangeExerciseOrder;
