module.exports.dumpUser = (user) => {
    const result = user ? {
        id              : user.id,
        email           : user.email,
        public_email    : user.public_email || null,
        first_name      : user.first_name,
        last_name       : user.last_name,
        state           : user.state,
        city            : user.city,
        address_line1   : user.address_line1,
        address_line2   : user.address_line2,
        phone           : user.phone,
        sex             : user.sex,
        birthdate       : user.birthdate,
        profile_img_url : user.profile_img_url,
        token           : user.token.token,
        refreshToken    : user.token.refreshToken,
    } : {}

    return result;
};

module.exports.dumpExercise = (exercise) => {
    const result = exercise ?  {
        id                       : exercise.id,
        exercise_groups_items_id : exercise.exercise_groups_items_id,
        order                    : exercise.order,
        primary_muscle_id        : exercise.primary_muscle_id || 'not specified',
        primary_muscle           : exercise.primary_muscle || 'not specified',
        ability_level            : exercise.ability_level.filter(item => item),
        ability_level_names      : exercise.ability_level_names.filter(item => item),
        type                     : exercise.type,
        name                     : exercise.name,
        description              : exercise.description,
        created_by               : exercise.created_by,
        company_id               : exercise.company_id,
        is_system_default        : exercise.is_system_default || false,
        is_favorite              : exercise.favorite ? true : false
    } : {}

    return result;
}

module.exports.dumpWorkout = (workout) => {
    const result = workout ? {
        id                  : workout.id,
        created_by          : workout.created_by,
        name                : workout.name,
        description         : workout.description,
        ability_level       : workout.ability_level.filter(item => item),
        ability_level_names : workout.ability_level_names.filter(item => item),
        type                : workout.type,
        company_id          : workout.company_id,
        is_system_default   : workout.is_system_default || false,
        is_favorite         : workout.favorite ? true : false
    } : {}

    return result;
}

module.exports.dumpExerciseGroup = (group) => {
    const result = group ? {
        id         : group.id,
        workout_id : group.workout_id,
        name       : group.name,
        order      : group.order,
    } : {}

    return result;
}

module.exports.dumpPhysCondition = (physicalCondition) => {
    const result = physicalCondition ? {
        id               : physicalCondition.id,
        user_id          : physicalCondition.user_id,
        weight           : physicalCondition.weight,
        tricep           : physicalCondition.tricep,
        chest            : physicalCondition.chest,
        subscapular      : physicalCondition.subscapular,
        suprailiac       : physicalCondition.suprailiac,
        abdominal        : physicalCondition.abdominal,
        midaxillary      : physicalCondition.midaxillary,
        thigh            : physicalCondition.thigh,
        total_body_fat_p : physicalCondition.total_body_fat_p,
        lean_mass        : physicalCondition.lean_mass,
        arm_l            : physicalCondition.arm_l,
        arm_r            : physicalCondition.arm_r,
        thigh_l          : physicalCondition.thigh_l,
        thigh_r          : physicalCondition.thigh_r,
        calf_l           : physicalCondition.calf_l,
        calf_r           : physicalCondition.calf_r,
        neck             : physicalCondition.neck,
        waist            : physicalCondition.waist,
        hips             : physicalCondition.hips,
        additional_info  : physicalCondition.additional_info,
        created_at       : physicalCondition.created_at,
        updated_at       : physicalCondition.updated_at
    } : {}

    return result;
}

module.exports.dumpForecast = (forecast) => {
    const result = forecast ? {
        id                : forecast.id,
        created_by        : forecast.created_by,
        company_id        : forecast.company_id,
        name              : forecast.name,
        gender            : forecast.gender,
        goal_direction    : forecast.goal_direction,
        fitness_level     : forecast.fitness_level,
        term              : forecast.term,
        style             : forecast.style,
        rest              : forecast.rest,
        sequence          : forecast.sequence,
        is_system_default : forecast.is_system_default || false
    } : {}

    return result;
}

module.exports.dumpProgram = (program) => {
    const result = program ? {
        id                        : program.id,
        trainer_id                : program.trainer_id,
        gender                    : program.gender,
        status                    : program.status,
        goal_direction            : program.goal_direction,
        fitness_level             : program.fitness_level,
        count_of_weeks            : program.count_of_weeks,
        lean_mass_goal            : program.lean_mass_goal,
        weight_loss_goal          : program.weight_loss_goal,
        workout_sessions_per_week : program.workout_sessions_per_week,
        goal_direction            : program.goal_direction,
        start_date                : program.start_date,
        term                      : program.term, 
        food_data                 : program.food_data,
        suppliments_data          : program.suppliments_data,
        workout_data              : program.workout_data,
        water_data                : program.water_data,
        is_system_default         : program.is_system_default || false
    } : {}

    return result;
}

module.exports.dumpPhase = (phase) => {
    const result = phase ? {
        phase_number             : phase.phaseNumber,
        phase_starting_weight    : phase.startingWeight,
        phase_weight             : phase.newCurrentWeight,
        lost_weight_during_phase : phase.weightLossGoal,
        weight_loss_percent      : phase.weightLossGoalP * 100,
        calories                 : phase.calories,
        activity_level           : phase.activity_level,
        cardio_mins_per_week     : phase.total_cardio_mins,
        workout_suggestions      : phase.workoutSuggestions
    } : {}

    return result;
}