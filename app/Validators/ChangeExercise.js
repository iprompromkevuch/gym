'use strict'
const { validate, rule, formatters } = use('Validator')

class ChangeExercise {
  get rules() {
    return {
      primary_muscle_id : 'required|integer',
      ability_level     : 'required|array',
      "ability_level.*" : 'required|integer|range:0,4',
      type              : 'required|integer',
      name              : 'required|string',
      description       : 'required|string',
      company_id        : 'required|integer',
    }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = ChangeExercise;
