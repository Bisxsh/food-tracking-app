// @ts-nocheck
import { IngredientBuilder, weightUnit } from "../classes/IngredientClass";

export function getIngredientBuilder(ingredientJSON: any) {
  if (ingredientJSON.status_verbose !== "product found") {
    alert("Product not found. Please enter details manually.");
    return new IngredientBuilder();
  }
  let product = ingredientJSON.product;
  const ingredientBuilder = new IngredientBuilder();
  ingredientBuilder.setName(product.product_name);
  ingredientBuilder.setImgSrc(product.image_front_url);
  ingredientBuilder.setQuantity(1);
  ingredientBuilder.setCategories([]);
  ingredientBuilder.setExpiryDate(new Date());
  ingredientBuilder.setUseDate(new Date());
  ingredientBuilder.setServingSize(product.serving_quantity);
  ingredientBuilder.setServingSizeType(
    product.serving_size.replace(/\d/g, "") == "g"
      ? weightUnit.grams
      : weightUnit.kg
  );
  ingredientBuilder.setWeight(
    ingredientJSON.product.packagings[0].quantity_per_unit_value
  );
  ingredientBuilder.setWeightType(
    ingredientJSON.product.packagings[0].quantity_per_unit_unit == "g"
      ? weightUnit.grams
      : weightUnit.kg
  );

  let nutritionBuilder = ingredientBuilder.getNutritionBuilder();
  nutritionBuilder.setCarbs(product.nutriments.carbohydrates_serving);
  // prettier-ignore
  nutritionBuilder.setEnergy(product.nutriments["energy-kcal_serving"]);
  nutritionBuilder.setProtein(product.nutriments.proteins_serving);
  nutritionBuilder.setFat(product.nutriments.fat_serving);
  nutritionBuilder.setSaturatedFat(product.nutriments["saturated-fat_serving"]);
  nutritionBuilder.setFibre(product.nutriments.fiber_serving);
  nutritionBuilder.setSalt(product.nutriments.salt_serving);
  nutritionBuilder.setSugar(product.nutriments.sugars_serving);

  return ingredientBuilder;
}
