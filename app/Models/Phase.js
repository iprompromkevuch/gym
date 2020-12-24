'use strict'
const Database = use('Database');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Phase extends Model { 
    static COUNT_OF_PHASES = 4;

    static get table () {
        return 'none';
    }

    static async calculatePhasesData(data) {
        // get data by phases for every weight from db
        const weightLossRatioData = await Database.raw(`
            Select * from weight_loss_v1
            where gender = '${data.gender}'
        `);

        const leanFactor = await Database.raw(`
            SELECT * from lean_factor_v1 
            where gender = '${data.gender}'
            AND body_fat_from < ${data.body_fat_p}
            AND body_fat_to > ${data.body_fat_p}
        `);
        
        const dailyActivity = await Database.raw(`
            SELECT * from daily_activity_v1 
            where gender = '${data.gender}'
        `);

        const nbCapiler = await Database.raw(`
            SELECT * from nb_capiler_v1 
        `);

        const workoutsPerWeek = await Database.raw(`
            SELECT * from workouts_per_week 
        `);

        let result = {
            data : [],
            versions : {
                weight_loss_ratio_table_version : 1,
                lean_factor_table_version       : 1,
                daily_activity_table_version    : 1
            }
        }; // result

        // weight
        let rightRowInTable = {}; // row of phase loses (weight, weight_loss_ratio, ratio_increment -> increment)
        let currentWeight = data.current_weight; // changed on each phase
        let onePhaseData = {}; // data of one phase
        let startingWeight = {}; // start weight
        let totalCardioMins = 0; // total cardio minutes
        let workoutSuggestions = {}; // workout suggestions

        // calories
        let calories = 0; // calories loss on each phase
        let rightLeanFactor = leanFactor.rows[0];
        let dailyActivityTable = dailyActivity.rows;
        let currentActivityLevel = dailyActivityTable.filter(item => item.gender === data.gender && item.activity_level === data.activity_level)[0];
        const nbCapilerFromTable = nbCapiler.rows;
        const workoutsPerWeekFromTable = workoutsPerWeek.rows;

        for (let i = 0; i < this.COUNT_OF_PHASES; i++) {
            // weight
            rightRowInTable = this._getClosestWeight(currentWeight, weightLossRatioData.rows, i+1) // choose of phase to calculate
            onePhaseData = this._calculateOnePhaseData(rightRowInTable, currentWeight); // calculate weight loss goal, new current weight
            startingWeight = currentWeight;
            currentWeight = onePhaseData.newCurrentWeight; // change current weight for new phase      

            // calories
            calories = this._calculateCalories(currentWeight, rightLeanFactor, currentActivityLevel, data.gender);

            // cardio
            totalCardioMins = this._calculateTotalCardioMins(data.weight_loss_goal, nbCapilerFromTable, i+1, data.weeksCount);

            // workout suggestions
            workoutSuggestions = this._calculateWorkoutSuggestions(data.goal_direction, workoutsPerWeekFromTable, i+1, totalCardioMins);

            // push to result
            result.data.push({
                ...onePhaseData, 
                startingWeight, 
                calories, 
                phaseNumber       : i + 1, 
                activity_level    : currentActivityLevel.activity_level,
                total_cardio_mins : totalCardioMins,
                workoutSuggestions,
            });
            
            currentActivityLevel = i === 1 
                ? this._addActivityLevel(currentActivityLevel, dailyActivityTable) 
                : currentActivityLevel;
        }

        return result;
    }

    static _calculateWorkoutSuggestions(goal_direction, workoutsPerWeekTable, phase_number, cardio_mins) {
        const filteredWorkouts = workoutsPerWeekTable.filter(item => {
            return item.phase === phase_number && item.program === goal_direction
        });
        if (!filteredWorkouts || !filteredWorkouts.length) {
            return {
                program: goal_direction,
                number_of_workouts: {
                    morning: 'not specified for this type of program',
                    evening: 'not specified for this type of program',
                    total: 'not specified for this type of program',
                    cardio_mins_per_session: 'not specified for this type of program',
                }
            }
        }

        const result = {
            program: goal_direction,
            number_of_workouts: {
                morning: filteredWorkouts[0].number <= 6 ? filteredWorkouts[0].number : 6, // by default 6
                evening: filteredWorkouts[0].number <= 6 ? 0 : filteredWorkouts[0].number - 6,
                total: filteredWorkouts[0].number,
                cardio_mins_per_session: Math.round(cardio_mins / filteredWorkouts[0].number),
            }
        }
        return result;
    }

    static _calculateTotalCardioMins(weight_loss_goal, nb_caliper, phase_number, weeksCount) {
        let cardioMins = 0;
        const nbCapilerRight = nb_caliper.filter(item => {
            return item.weeks_count === weeksCount && weight_loss_goal <= item.weight_to && weight_loss_goal >= item.weight_from
        })[0];

        const nbCapilerRatioPhase1 = 0.09;
        const nbCapilerRatioPhase2 = 0.19;
        const nbCapilerRatioPhase3 = 0.4;
        const nbCapilerRatioPhase4 = 0.32;

        if (!weight_loss_goal || !nb_caliper || !phase_number || !weeksCount || !nbCapilerRight) {
            return 'program is not specified or specified with wrong data';
        }

        if (phase_number === 1) {
            cardioMins = (nbCapilerRatioPhase1 * weight_loss_goal * nbCapilerRight.nb_capiler) / (weeksCount === 32 ? 6 : 3);
        } else if (phase_number === 2) {
            cardioMins = nbCapilerRatioPhase2 * weight_loss_goal * nbCapilerRight.nb_capiler / (weeksCount === 32 ? 8 : 4);
        } else if (phase_number === 3) {
            cardioMins = nbCapilerRatioPhase3 * weight_loss_goal * nbCapilerRight.nb_capiler / (weeksCount === 32 ? 10 : 5);
        } else if (phase_number === 4) {
            cardioMins = nbCapilerRatioPhase4 * weight_loss_goal * nbCapilerRight.nb_capiler / (weeksCount === 32 ? 8 : 4);
        } else {
            cardioMins = 'specified data is wrong'
        }

        return cardioMins;
    }

    static _calculateOnePhaseData(data, currentWeight) {
        // formula to calculate percantage of loss data
        const weightLossGoalP = +data.weight_loss_ratio + ((+currentWeight - +data.weight) * +data.increment); 
        return {
            newCurrentWeight : currentWeight - currentWeight * weightLossGoalP,
            weightLossGoalP  : weightLossGoalP,
            weightLossGoal   : currentWeight * weightLossGoalP
        };
    }

    static _getClosestWeight(userWeight, tableWeights, phaseNumber) {
        let result = '';

        const weightsOfCurrentPhase = tableWeights.filter(item => item.phase_number === phaseNumber);

        for (let i = 0; i < tableWeights.length; i++) {
            if (phaseNumber === tableWeights[i].phase_number && 
                tableWeights[i].weight < userWeight && tableWeights[i+1].weight > userWeight ) {
                    result = tableWeights[i];
                    break;
            }
        }

        // find phase min and max weight if userweight out of range
        if (!result && userWeight <= weightsOfCurrentPhase[0].weight) {
            result = weightsOfCurrentPhase[0];
        } else if (!result && userWeight >= weightsOfCurrentPhase[weightsOfCurrentPhase.length - 1].weight) {
            result = weightsOfCurrentPhase[weightsOfCurrentPhase.length - 1];
        }

        return result;
    }

    static _calculateCalories(currentWeight, leanFactor, dailyActivity, gender) {
        const stepOne = currentWeight / 2.2; // from pounds to kg - bodyweight in kg
        const stepTwo = 24 * (gender === 'male' ? stepOne : stepOne * 0.9) // if user is a man -> * 1.0, woman -> * 0.9
        const stepThree = leanFactor.multiplier;
        const stepFour = stepTwo * stepThree; // BMR - lean factor * step 2
        const stepFive = dailyActivity.multiplier;
        const result = stepFive * stepFour; // calories to be consumed

        return result;
    }

    static _addActivityLevel(current, table) {
        let result = {};

        for(let i = 0; i < table.length; i++) {
            if (current.gender === table[i].gender && current.activity_level === table[i].activity_level) {
                result = table[i+1] ? table[i+1] : table[i];
            } 
        }

        return result;
    }
}

module.exports = Phase;