import { PricingCalculation } from '../types/credits';

const USD_TO_SAR = 3.75;
const BASE_RATE = 1;

const PACKAGE_TIERS = [
  { credits: 15, price_sar: 10 },
  { credits: 80, price_sar: 50 },
  { credits: 175, price_sar: 100 },
  { credits: 450, price_sar: 250 },
  { credits: 1000, price_sar: 500 },
  { credits: 2450, price_sar: 1000 },
];

export function calculatePrice(credits: number): PricingCalculation {
  let price_sar: number;

  if (credits < 15) {
    price_sar = credits * BASE_RATE;
  } else {
    const lowerTier = PACKAGE_TIERS.slice()
      .reverse()
      .find(tier => credits >= tier.credits);

    const upperTier = PACKAGE_TIERS.find(tier => credits <= tier.credits);

    if (lowerTier && upperTier && lowerTier !== upperTier) {
      const lowerRate = lowerTier.price_sar / lowerTier.credits;
      const upperRate = upperTier.price_sar / upperTier.credits;
      const creditRange = upperTier.credits - lowerTier.credits;
      const creditOffset = credits - lowerTier.credits;
      const interpolationFactor = creditOffset / creditRange;
      const rate = lowerRate + (upperRate - lowerRate) * interpolationFactor;
      price_sar = credits * rate;
    } else if (lowerTier) {
      const rate = lowerTier.price_sar / lowerTier.credits;
      price_sar = credits * rate;
    } else if (upperTier) {
      const rate = upperTier.price_sar / upperTier.credits;
      price_sar = credits * rate;
    } else {
      price_sar = credits * BASE_RATE;
    }
  }

  price_sar = Math.round(price_sar * 100) / 100;

  const price_usd = Math.round((price_sar / USD_TO_SAR) * 100) / 100;
  const price_per_credit = Math.round((price_sar / credits) * 100) / 100;
  const base_price = credits * BASE_RATE;
  const savings = Math.round((base_price - price_sar) * 100) / 100;
  const discount_percentage = Math.round(((base_price - price_sar) / base_price) * 10000) / 100;

  return {
    credits,
    price_sar,
    price_usd,
    price_per_credit,
    savings: Math.max(0, savings),
    discount_percentage: Math.max(0, discount_percentage),
  };
}

export function calculatePricePerCredit(credits: number): number {
  const result = calculatePrice(credits);
  return result.price_per_credit;
}

export function calculateSavings(credits: number): number {
  const result = calculatePrice(credits);
  return result.savings;
}

export function getNearestPackage(credits: number): { credits: number; price_sar: number } | null {
  if (credits < 15) return null;

  const exactMatch = PACKAGE_TIERS.find(tier => tier.credits === credits);
  if (exactMatch) return exactMatch;

  const closestUpper = PACKAGE_TIERS.find(tier => tier.credits > credits);
  const closestLower = PACKAGE_TIERS.slice()
    .reverse()
    .find(tier => tier.credits < credits);

  if (!closestUpper && !closestLower) return null;
  if (!closestUpper) return closestLower!;
  if (!closestLower) return closestUpper;

  const upperDiff = closestUpper.credits - credits;
  const lowerDiff = credits - closestLower.credits;

  return upperDiff < lowerDiff ? closestUpper : closestLower;
}

export function sarToUsd(sar: number): number {
  return Math.round((sar / USD_TO_SAR) * 100) / 100;
}

export function usdToSar(usd: number): number {
  return Math.round((usd * USD_TO_SAR) * 100) / 100;
}
