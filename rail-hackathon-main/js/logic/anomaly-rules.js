const RULES_CONFIG = {
  traction_motor: { temperature: { maxThreshold: 85, rapidGrowthLimit: 10 } }
};

export const checkMeasurement = (equipmentType, metric, currentValue, previousValue) => {
  const config = RULES_CONFIG[equipmentType]?.[metric];
  if (!config) return { hasDeviation: false };

  if (currentValue >= config.maxThreshold) {
    return { hasDeviation: true, severity: "critical", ruleId: "threshold-exceeded", message: `Превышение нормы: ${currentValue} >= ${config.maxThreshold}`, recommendation: "Создать задачу на ремонт" };
  }
  if (previousValue !== null && (currentValue - previousValue) >= config.rapidGrowthLimit) {
    return { hasDeviation: true, severity: "warning", ruleId: "rapid-growth", message: `Резкий рост: +${currentValue - previousValue}`, recommendation: "Дополнительный осмотр" };
  }
  return { hasDeviation: false };
};
