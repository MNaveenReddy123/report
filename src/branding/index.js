import maki from "./maki.json";
import acme from "./acme.json";
import defaultBrand from "./default.json";

const brands = {
  maki,
  acme
};

export function getBrandConfig(brandName) {
  return brands[brandName] || defaultBrand;
}
