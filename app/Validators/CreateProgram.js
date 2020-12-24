'use strict'
const { validate, rule, formatters } = use('Validator')

class CreateProgram {
  get rules() {
      return {
        trainer_id       : 'required|integer',
        status           : 'required|integer',
        goal_direction   : 'required|string|in:Weight Loss,Re-costruction,Maintaince,Weight gain,Contest',
        count_of_weeks   : 'required|integer|in:16,32',
        lean_mass_goal   : 'required|integer',
        weight_loss_goal : 'required|integer',
        start_date       : 'required|date',
        term             : 'required|integer', 
        food_data        : 'required|object',
        suppliments_data : 'required|object',
        workout_data     : 'required|object',
        water_data       : 'required|object',
        company_id       : 'required|integer',
        gender           : 'required|string|in:male,female',
        fitness_level    : 'required|string|in:beginner,semi-moderate,intermediate,heavy,pro',
        workout_sessions_per_week: 'required|integer|in:1,2,3,4,5,6,7'
      }
  }
  
  async fails (errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
  
  get formatter () {
    return formatters.JsonApi
  }
}

module.exports = CreateProgram;
