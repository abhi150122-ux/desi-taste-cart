export const inr = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const DELIVERY_FEE = 40;
export const FREE_DELIVERY_ABOVE = 1499;
export const TAX_RATE = 0.05;

export const COUPONS: Record<string, { amount: number; minimum: number; label: string }> = {
  JAIN100: { amount: 100, minimum: 999, label: "₹100 off on orders above ₹999" },
  PURE50: { amount: 50, minimum: 499, label: "₹50 off on orders above ₹499" },
};
