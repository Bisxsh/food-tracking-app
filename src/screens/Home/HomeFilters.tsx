export enum HomeFilter {
  ExpiryDateLowToHigh = "Expiry Date: Low to High",
  ExpiryDateHighToLow = "Expiry Date: High to Low",
  QuantityLowToHigh = "Quantity: Low to High",
  QuantityHighToLow = "Quantity: High to Low",
}

export const HomeFilters = [
  HomeFilter.ExpiryDateLowToHigh,
  HomeFilter.ExpiryDateHighToLow,
  HomeFilter.QuantityLowToHigh,
  HomeFilter.QuantityHighToLow,
];
