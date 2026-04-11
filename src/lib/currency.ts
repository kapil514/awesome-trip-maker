// Country → currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, { code: string; symbol: string }> = {
  india: { code: "INR", symbol: "₹" },
  "united arab emirates": { code: "AED", symbol: "د.إ" },
  uae: { code: "AED", symbol: "د.إ" },
  "united states": { code: "USD", symbol: "$" },
  usa: { code: "USD", symbol: "$" },
  china: { code: "CNY", symbol: "¥" },
  japan: { code: "JPY", symbol: "¥" },
  thailand: { code: "THB", symbol: "฿" },
  indonesia: { code: "IDR", symbol: "Rp" },
  malaysia: { code: "MYR", symbol: "RM" },
  singapore: { code: "SGD", symbol: "S$" },
  vietnam: { code: "VND", symbol: "₫" },
  "south korea": { code: "KRW", symbol: "₩" },
  "united kingdom": { code: "GBP", symbol: "£" },
  uk: { code: "GBP", symbol: "£" },
  france: { code: "EUR", symbol: "€" },
  germany: { code: "EUR", symbol: "€" },
  italy: { code: "EUR", symbol: "€" },
  spain: { code: "EUR", symbol: "€" },
  turkey: { code: "TRY", symbol: "₺" },
  australia: { code: "AUD", symbol: "A$" },
  canada: { code: "CAD", symbol: "C$" },
  mexico: { code: "MXN", symbol: "Mex$" },
  brazil: { code: "BRL", symbol: "R$" },
  "south africa": { code: "ZAR", symbol: "R" },
  egypt: { code: "EGP", symbol: "E£" },
  nepal: { code: "NPR", symbol: "रू" },
  "sri lanka": { code: "LKR", symbol: "Rs" },
  maldives: { code: "MVR", symbol: "Rf" },
  switzerland: { code: "CHF", symbol: "CHF" },
};

export function getCurrencyForCountry(country: string): { code: string; symbol: string } {
  const key = country.toLowerCase().trim();
  return COUNTRY_CURRENCY_MAP[key] || { code: "INR", symbol: "₹" };
}

export function formatCurrency(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()}`;
  }
}

export function requiresVisa(country: string): boolean {
  const key = country.toLowerCase().trim();
  return key !== "india";
}
