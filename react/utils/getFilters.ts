import { useIntl } from 'react-intl'
import type {
  VtexSpecificationFilter,
  GetFiltersFacet,
  GetFiltersDeliveryFacet,
  GetFiltersResult,
  GetFiltersParams,
} from '../types'

export const SHIPPING_TITLE = 'store/search.filter.title.shipping'
export const CATEGORIES_TITLE = 'store/search.filter.title.categories'
export const BRANDS_TITLE = 'store/search.filter.title.brands'
export const PRICE_RANGES_TITLE = 'store/search.filter.title.price-ranges'

export const shippingOptions: Record<string, string> = {
  delivery: 'store/search.filter.shipping.name.delivery',
  'pickup-in-point': 'store/search.filter.shipping.name.pickup-in-point',
  'pickup-nearby': 'store/search.filter.shipping.name.pickup-nearby',
  'pickup-all': 'store/search.filter.shipping.name.pickup-all',
}

export const SHIPPING_KEY: string = 'shipping'

const BRANDS_TYPE: string = 'Brands'
const PRICE_RANGES_TYPE: string = 'PriceRanges'
const SPECIFICATION_FILTERS_TYPE: string = 'SpecificationFilters'

const getFilters = ({
  specificationFilters = [],
  priceRanges = [],
  brands = [],
  deliveries = [],
  brandsQuantity = 0,
  hiddenFacets = {},
  showShippingFacet = false,
  availableShippingValues = [],
}: GetFiltersParams): GetFiltersResult[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const intl = useIntl()

  let deliveriesFormatted: GetFiltersDeliveryFacet[] = deliveries

  let shipping: GetFiltersDeliveryFacet | undefined = deliveries.find((d: GetFiltersDeliveryFacet) => d.name === SHIPPING_KEY)

  if (shipping && availableShippingValues.length !== 0) {
    shipping = {
      ...shipping,
      facets: shipping.facets.filter((facet: GetFiltersFacet) =>
        availableShippingValues.includes(facet.name)
      ),
    }
  }

  if (shipping) {
    const shippingFormattedFacetsName: GetFiltersDeliveryFacet = {
      ...shipping,
      title: SHIPPING_TITLE,
      facets: shipping.facets.map((facet: GetFiltersFacet) => ({
        ...facet,
        name: intl.formatMessage({ id: shippingOptions[facet.name] }),
      })),
    }

    deliveriesFormatted = deliveries.map((facet: GetFiltersDeliveryFacet) =>
      facet.name === SHIPPING_KEY ? shippingFormattedFacetsName : facet
    )
  }

  if (!showShippingFacet) {
    deliveriesFormatted = deliveriesFormatted.filter(
      (d: GetFiltersDeliveryFacet) => d.name !== SHIPPING_KEY
    )
  }

  const hiddenFacetsNames: string[] = (
    hiddenFacets?.specificationFilters?.hiddenFilters || []
  ).map((filter: { name: string }) => filter.name)

  const mappedSpecificationFilters: GetFiltersResult[] = !hiddenFacets?.specificationFilters?.hideAll
    ? specificationFilters
        .filter((spec: VtexSpecificationFilter) => !hiddenFacetsNames.includes(spec.name) && !(spec as any).hidden)
        .map((spec: VtexSpecificationFilter): GetFiltersResult => ({
          type: SPECIFICATION_FILTERS_TYPE,
          title: spec.name,
          facets: spec.facets as GetFiltersFacet[],
          quantity: (spec as any).quantity,
          key: spec.facets?.[0]?.key,
        }))
    : []

  const brandFilter: GetFiltersResult | false = !hiddenFacets.brands &&
    brands.length > 0 && {
      type: BRANDS_TYPE,
      title: BRANDS_TITLE,
      facets: brands as GetFiltersFacet[],
      quantity: brandsQuantity,
    }

  const priceRangeFilter: GetFiltersResult | false = !hiddenFacets.priceRange &&
    priceRanges.length > 0 && {
      type: PRICE_RANGES_TYPE,
      title: PRICE_RANGES_TITLE,
      facets: priceRanges as GetFiltersFacet[],
    }

  // Convert deliveries to GetFiltersResult format
  const deliveriesAsFilters: GetFiltersResult[] = deliveriesFormatted.map((delivery: GetFiltersDeliveryFacet): GetFiltersResult => ({
    type: delivery.type || 'Delivery',
    title: delivery.title || delivery.name,
    facets: delivery.facets,
    quantity: delivery.quantity,
    key: delivery.key,
  }))

  return [
    ...deliveriesAsFilters,
    ...mappedSpecificationFilters,
    brandFilter,
    priceRangeFilter,
  ].filter(Boolean) as GetFiltersResult[]
}

export default getFilters
