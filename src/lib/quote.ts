import { getCategory } from "@/data/coverage-categories";

const BASE_MONTHLY: Record<string, number> = {
  financial: 18,
  savings: 15,
  auto: 35,
  home: 65,
  digital: 28,
  valuables: 20,
  life: 40,
  business: 55,
};

const TIER_MULTIPLIERS = [1, 1.7, 2.8, 4.5];

/**
 * Illustrative-only monthly estimate range. Not a real premium calculation —
 * a specialist confirms actual pricing and limits.
 */
export function estimateQuote(categoryKey: string, answers: Record<string, string>) {
  const base = BASE_MONTHLY[categoryKey] ?? 30;
  const category = getCategory(categoryKey);
  const rangeQuestion = category?.questions.find((q) => q.key.endsWith("_range"));

  let multiplier = TIER_MULTIPLIERS[0];
  if (rangeQuestion) {
    const idx = rangeQuestion.options.indexOf(answers[rangeQuestion.key] ?? "");
    if (idx >= 0 && TIER_MULTIPLIERS[idx] !== undefined) {
      multiplier = TIER_MULTIPLIERS[idx];
    }
  }

  const mid = base * multiplier;
  const low = Math.max(1, Math.round(mid * 0.85));
  const high = Math.round(mid * 1.25);

  return { low, high };
}