'use strict'
const { validate, rule, formatters } = use('Validator');

class CreatePhase {
  get rules() {
      return {
          activity_level: 'required|string|in:beginner,intermediate,semi moderate,pro,heavy',
      }
    }
  
    async fails (errorMessages) {
        return this.ctx.response.status(422).json(errorMessages)
    }
  
    get formatter () {
      return formatters.JsonApi
    }
}

module.exports = CreatePhase;
