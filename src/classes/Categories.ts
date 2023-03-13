import * as CategoryBack from "../backends/Category"

export interface Category {
  colour: string;
  name: string;
  active?: boolean;
  id?: number;
}

export function toCategoryBack(cat: Category): CategoryBack.Category{
  return new CategoryBack.Category(
    cat.name,
    cat.colour,
    cat.id,
    cat.active
  )
}
