export const getRandomItem = (options) => {
  const totalWeight = options.reduce((sum, opt) => sum + (opt.weight ?? 1), 0);
  const random = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const option of options) {
    cumulativeWeight += option.weight ?? 1;
    if (random < cumulativeWeight) {
      return option;
    }
  }

  return options[0];
};

export const normalizeWeights = (options) => {
  const total = options.reduce((sum, opt) => sum + (opt.weight ?? 1), 0);
  if (total === 0) {
    return options.map((opt) => ({ ...opt, weight: 1 / options.length }));
  }

  return options.map((opt) => ({
    ...opt,
    weight: (opt.weight ?? 1) / total,
  }));
};

export const chooseWeightedTier = (tierCounts) => {
  const entries = Object.entries(tierCounts);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (total === 0) {
    return entries[Math.floor(Math.random() * entries.length)][0];
  }

  const threshold = Math.random() * total;
  let cumulative = 0;

  for (const [tier, value] of entries) {
    cumulative += value;
    if (threshold < cumulative) {
      return tier;
    }
  }

  return entries[entries.length - 1][0];
};

export const selectMealByTiers = (options, calTierWeights, protTierWeights) => {
  const calTier = chooseWeightedTier(calTierWeights);
  const protTier = chooseWeightedTier(protTierWeights);
  const candidates = options.filter(
    (option) => option.calTier === calTier && option.protTier === protTier,
  );

  if (candidates.length > 0) {
    return getRandomItem(normalizeWeights(candidates));
  }

  const fallbackByCal = options.filter((option) => option.calTier === calTier);
  if (fallbackByCal.length > 0) {
    return getRandomItem(normalizeWeights(fallbackByCal));
  }

  const fallbackByProt = options.filter((option) => option.protTier === protTier);
  if (fallbackByProt.length > 0) {
    return getRandomItem(normalizeWeights(fallbackByProt));
  }

  return getRandomItem(normalizeWeights(options));
};

export const calculateWeightChange = (netCalories) => netCalories / 7700;
