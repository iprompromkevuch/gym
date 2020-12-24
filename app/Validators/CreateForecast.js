'use strict'
const { validate, rule, formatters } = use('Validator')

class CreateForecast {
  get rules() {
    return {
        name           : 'required|string',
        gender         : 'required|string|in:male,female',
        goal_direction : 'required|string',
        fitness_level  : 'required|string',
        term           : 'required|string',
        style          : 'required|string',
        rest           : 'required|string',
        sequence       : 'required|string',
        company_id     : 'required|integer'
    }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = CreateForecast;
