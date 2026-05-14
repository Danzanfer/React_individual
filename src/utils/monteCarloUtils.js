/**
 * Core Monte Carlo Utility: Weighted Random Selection
 * @param {Array} options - e.g. [{ name: 'Smoothie', weight: 0.85, cal: 350 }]
 * @returns {Object} - The randomly selected meal/workout
 */

export const getRandomItem = (options) => {
    const random = Math.random();
    let cumulativeWeight=0;

    for (const option of options){
        cumulativeWeight += option.weight;
        if (random < cumulativeWeight) {
            return option;
        }               
    } 
    return options[0];
};

export const normalizaWeights = (options) => {
    const total = options.reduce((sum,opt)=> sum + opt.weight, 0);
    return options.map(opt => ({ 
        ...opt, 
        weight: opt.weight / total }));
}
/**
 * Metric Weight Change Formula
 * Based on the 7,700 kcal per 1kg rule.
 */
export const calculateWeightChange = (deficit) => {
  return deficit / 7700;
};
