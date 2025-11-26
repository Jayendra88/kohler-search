import type { FacetGroup, VtexBrand, VtexPriceRange, VtexCategory, VtexSpecificationFilter, VtexFacetsData, FacetItem } from '../types';

/**
 * Transforms raw facets data from VTEX API into standardized FacetGroup format
 */
export class FacetTransformer {
  public static transformBrands(brands?: VtexBrand[]): FacetGroup | null {
    if (!brands || brands.length === 0) return null;

    return {
      name: 'Brands',
      type: 'brands',
      facets: brands.map((brand) => ({
        id: brand.id || brand.value,
        quantity: brand.quantity,
        name: brand.name,
        key: brand.key || brand.value,
        value: brand.value,
        selected: brand.selected || false,
      }))
    };
  }

  public static transformSpecificationFilters(specificationFilters?: VtexSpecificationFilter[]): FacetGroup[] {
    if (!specificationFilters || specificationFilters.length === 0) return [];

    return specificationFilters
      .filter((spec) => spec.facets && spec.facets.length > 0)
      .map((spec) => ({
        name: spec.name,
        type: 'specificationFilters' as const,
        key: spec.name,
        facets: spec.facets.map((facet) => facet as FacetItem)
      }));
  }

  public static transformCategoriesTrees(categoriesTrees?: VtexCategory[]): FacetGroup | null {
    if (!categoriesTrees || categoriesTrees.length === 0) return null;

    return {
      name: 'Categories',
      type: 'categoriesTrees',
      facets: categoriesTrees.map((category) => ({
        id: category.id || category.value,
        quantity: category.quantity,
        name: category.name,
        key: category.key || category.value,
        value: category.value,
        selected: category.selected || false,
      }))
    };
  }

  public static transformPriceRanges(priceRanges?: VtexPriceRange[]): FacetGroup | null {
    if (!priceRanges || priceRanges.length === 0) return null;

    return {
      name: 'Price Range',
      type: 'priceRanges',
      facets: priceRanges.map((price) => {
        // Convert range object to string if it's an object
        let rangeStr = '';
        if (price.range && typeof price.range === 'object') {
          const rangeObj = price.range as any;
          rangeStr = `${rangeObj.from || 0} TO ${rangeObj.to || 0}`;
        } else if (typeof price.range === 'string') {
          rangeStr = price.range;
        }

        const id = price.slug || rangeStr || `price-${price.quantity}`;
        const name = price.name || rangeStr || 'Price Range';

        return {
          id,
          quantity: price.quantity,
          name,
          key: id,
          value: id,
          selected: price.selected || false,
        };
      })
    };
  }

  public static transformAllFacets(facets: VtexFacetsData): FacetGroup[] {
    const {
      brands,
      priceRanges,
      specificationFilters,
      categoriesTrees,
    } = facets;

    const groups: FacetGroup[] = [];

    // Add brands
    const brandsGroup = this.transformBrands(brands);
    if (brandsGroup) groups.push(brandsGroup);

    // Add specification filters
    const specGroups = this.transformSpecificationFilters(specificationFilters);
    groups.push(...specGroups);

    // Add categories
    const categoriesGroup = this.transformCategoriesTrees(categoriesTrees);
    if (categoriesGroup) groups.push(categoriesGroup);

    // Add price ranges
    const priceGroup = this.transformPriceRanges(priceRanges);
    if (priceGroup) groups.push(priceGroup);

    return groups;
  }
}