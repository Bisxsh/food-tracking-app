export enum HomeSortingFilter {
  ExpiryDateFirstToLast = "Expiry Date: First to Last",
  ExpiryDateLastToFirst = "Expiry Date: Last to First",
  QuantityLowToHigh = "Quantity: Low to High",
  QuantityHighToLow = "Quantity: High to Low",
}

export const HomeSortingFilters = [
  HomeSortingFilter.ExpiryDateFirstToLast,
  HomeSortingFilter.ExpiryDateLastToFirst,
  HomeSortingFilter.QuantityLowToHigh,
  HomeSortingFilter.QuantityHighToLow,
];
