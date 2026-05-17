export const MEAL_OPTIONS = {
  breakfast: [
    { name: 'Smoothie Bowl', cal: 380, prot: 28, calTier: 'medium', protTier: 'high' },
    { name: 'Waffles', cal: 650, prot: 12, calTier: 'high', protTier: 'low' },
    { name: 'Eggs & Toast', cal: 420, prot: 30, calTier: 'medium', protTier: 'medium' },
    { name: 'Yogurt Parfait', cal: 290, prot: 18, calTier: 'low', protTier: 'medium' },
    { name: 'Pancakes', cal: 560, prot: 20, calTier: 'high', protTier: 'medium' },
    { name: 'Fruit Oatmeal', cal: 310, prot: 14, calTier: 'low', protTier: 'low' },
  ],
  lunch: [
    { name: 'Chicken & Rice', cal: 580, prot: 42, calTier: 'medium', protTier: 'high' },
    { name: 'Burger Bowl', cal: 720, prot: 28, calTier: 'high', protTier: 'medium' },
    { name: 'Grain Salad', cal: 340, prot: 22, calTier: 'low', protTier: 'medium' },
    { name: 'Pasta with Veggies', cal: 610, prot: 20, calTier: 'high', protTier: 'low' },
    { name: 'Steak Sandwich', cal: 540, prot: 36, calTier: 'medium', protTier: 'high' },
    { name: 'Tofu Bowl', cal: 300, prot: 18, calTier: 'low', protTier: 'low' },
  ],
  dinner: [
    { name: 'Salmon Salad', cal: 520, prot: 38, calTier: 'medium', protTier: 'high' },
    { name: 'Pizza Slice', cal: 820, prot: 24, calTier: 'high', protTier: 'medium' },
    { name: 'Veggie Stir Fry', cal: 360, prot: 16, calTier: 'low', protTier: 'low' },
    { name: 'Beef Stew', cal: 650, prot: 34, calTier: 'high', protTier: 'medium' },
    { name: 'Quinoa Bowl', cal: 410, prot: 30, calTier: 'medium', protTier: 'high' },
    { name: 'Tofu Curry', cal: 480, prot: 24, calTier: 'medium', protTier: 'medium' },
  ],
};

export const CONSTANTS = {
  KCAL_PER_KG: 7700,
  STARTING_WEIGHT: 78,
  MAINTENANCE_CAL: 2600,
  GUILTY_DISH: { name: 'Guilty Pleasure Pizza', cal: 1100, prot: 30, calTier: 'high', protTier: 'medium' },
};

export const DEFAULT_SETUP = {
  startingWeight: CONSTANTS.STARTING_WEIGHT,
  maintenanceCal: CONSTANTS.MAINTENANCE_CAL,
  activeCal: 300,
  guiltyChance: 15,
  proteinTargets: {
    low: 20,
    medium: 35,
    high: 50,
  },
  mealFrequencies: {
    breakfast: {
      cal: { high: 3, medium: 3, low: 1 },
      prot: { high: 2, medium: 3, low: 2 },
    },
    lunch: {
      cal: { high: 2, medium: 3, low: 2 },
      prot: { high: 2, medium: 3, low: 2 },
    },
    dinner: {
      cal: { high: 2, medium: 3, low: 2 },
      prot: { high: 2, medium: 3, low: 2 },
    },
  },
};
