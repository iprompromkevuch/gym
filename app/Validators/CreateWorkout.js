'use strict'
const { validate, rule, formatters } = use('Validator')

class CreateWorkout {
  get rules() {
    return {
      name              : "required|string",
      description       : "required|string",
      ability_level     : 'required|array',
      "ability_level.*" : 'required|integer|range:0,4',
      type              : "required|integer",
      company_id        : "required|integer"
    }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = CreateWorkout;
