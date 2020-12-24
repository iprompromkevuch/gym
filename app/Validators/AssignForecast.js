'use strict'
const { validate, rule, formatters } = use('Validator')

class AssignForecast {
  get rules() {
    return {
        forecast_id : 'required|integer',
        program_id  : 'required|integer'
    }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = AssignForecast;
