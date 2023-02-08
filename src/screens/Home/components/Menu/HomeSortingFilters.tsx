export enum HomeSortingFilter {
  ExpiryDateLowToHigh = "Expiry Date: Low to High",
  ExpiryDateHighToLow = "Expiry Date: High to Low",
  QuantityLowToHigh = "Quantity: Low to High",
  QuantityHighToLow = "Quantity: High to Low",
}

export const HomeSortingFilters = [
  HomeSortingFilter.ExpiryDateLowToHigh,
  HomeSortingFilter.ExpiryDateHighToLow,
  HomeSortingFilter.QuantityLowToHigh,
  HomeSortingFilter.QuantityHighToLow,
];
