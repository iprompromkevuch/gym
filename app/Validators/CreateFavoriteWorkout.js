'use strict'
const { validate, rule, formatters } = use('Validator')

class CreateFavoriteWorkout {
  get rules() {
    return {
        workout_id : 'required|integer',
    }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = CreateFavoriteWorkout;
