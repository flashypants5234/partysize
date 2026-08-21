import {
  Landmark,
  PiggyBank,
  Car,
  Home,
  Bitcoin,
  Gem,
  HeartPulse,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import type { CategoryKey } from "@/data/coverage-categories";

const ICONS: Record<CategoryKey, LucideIcon> = {
  financial: Landmark,
  savings: PiggyBank,
  auto: Car,
  home: Home,
  digital: Bitcoin,
  valuables: Gem,
  life: HeartPulse,
  business: Briefcase,
};

export default function CategoryIcon({ category, size = 28 }: { category: CategoryKey; size?: number }) {
  const Icon = ICONS[category];
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}