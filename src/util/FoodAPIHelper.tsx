// @ts-nocheck
import { IngredientBuilder, weightUnit } from "../classes/IngredientClass";

export function getIngredientBuilder(ingredientJSON: any) {
  if (ingredientJSON.status_verbose !== "product found") {
    alert("Product not found. Please enter details manually.");
    return new IngredientBuilder();
  }

  console.log(ingredientJSON?.product?.product_quantity);
  let product = ingredientJSON.product;
  const ingredientBuilder = new IngredientBuilder();
  ingredientBuilder.setName(product?.product_name || "");
  ingredientBuilder.setImgSrc(product?.image_front_url || "");
  ingredientBuilder.setQuantity(1);
  ingredientBuilder.setCategories([]);
  ingredientBuilder.setExpiryDate(new Date());
  ingredientBuilder.setUseDate(new Date());
  ingredientBuilder.setServingSize(product?.serving_quantity || 0);
  ingredientBuilder.setServingSizeType(
    product.serving_size?.replace(/\d/g, "") == "g"
      ? weightUnit.grams
      : weightUnit.kg || weightUnit.grams
  );
  ingredientBuilder.setWeight(
    ingredientJSON.product?.packagings[0]?.quantity_per_unit_value ||
      ingredientJSON?.product?.product_quantity ||
      0
  );
  ingredientBuilder.setWeightType(
    (ingredientJSON.product?.packagings[0]?.quantity_per_unit_unit ||
      ingredientJSON?.product?.quantity?.slice(-1) ||
      "") == "g"
      ? weightUnit.grams
      : weightUnit.kg || weightUnit.grams
  );

  let nutritionBuilder = ingredientBuilder.getNutritionBuilder();
  nutritionBuilder.setCarbs(
    product.nutriments.carbohydrates_serving ||
      product.nutriments.carbohydrates ||
      0
  );
  // prettier-ignore
  nutritionBuilder.setEnergy(product.nutriments["energy-kcal_serving"] || product.nutriments["energy-kcal"] || 0);
  nutritionBuilder.setProtein(
    product.nutriments.proteins_serving || product.nutriments.proteins || 0
  );
  nutritionBuilder.setFat(
    product.nutriments.fat_serving || product.nutriments.fat || 0
  );
  nutritionBuilder.setSaturatedFat(
    product.nutriments["saturated-fat_serving"] ||
      product.nutriments["saturated-fat"] ||
      0
  );
  nutritionBuilder.setFibre(
    product.nutriments.fiber_serving || product.nutriments.fiber || 0
  );
  nutritionBuilder.setSalt(
    product.nutriments.salt_serving || product.nutriments.salt || 0
  );
  nutritionBuilder.setSugar(
    product.nutriments.sugars_serving || product.nutriments.sugars || 0
  );

  return ingredientBuilder;
}
