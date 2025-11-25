import { PATH_SEPARATOR, MAP_VALUES_SEP } from '../constants'
import { shippingOptions, SHIPPING_KEY } from './getFilters'
import {
  CompatibilityFacetValue,
  CompatibilityFacet,
  SelectedFacet,
  QueryArgs,
  MainSearches,
  CompatibilityPriceRange,
  DetachedFilters,
  GroupedFilters,
} from '../types'

const shippingFacetDefault: CompatibilityFacet = {
  name: SHIPPING_KEY,
  type: 'DELIVERY',
  hidden: false,
  quantity: 0,
  facets: Object.keys(shippingOptions).map((option: string): CompatibilityFacetValue => ({
    id: null,
    quantity: 0,
    name: option,
    key: SHIPPING_KEY,
    selected: false,
    map: SHIPPING_KEY,
    value: option,
  })),
}

export const getMainSearches = (query: string | null | undefined, map: string | null | undefined): MainSearches => {
  const querySegments: string[] = (query && query.split(PATH_SEPARATOR)) || []
  const mapSegments: string[] = (map && map.split(MAP_VALUES_SEP)) || []
  
  // Create object from key-value pairs using native JavaScript
  const zip: Record<string, string> = {}
  mapSegments.forEach((key, index) => {
    if (querySegments[index] !== undefined) {
      zip[key] = querySegments[index]
    }
  })

  return {
    ft: zip.ft,
    productClusterIds: zip.productClusterIds,
    seller: zip.seller,
  }
}

export const buildSelectedFacetsAndFullText = (
  query: string | null | undefined, 
  map: string | null | undefined, 
  priceRange?: string
): [SelectedFacet[], string | undefined] => {
  if (!map || !query) {
    return [[], undefined]
  }

  const queryValues: string[] = query.split('/')
  const mapValues: string[] = decodeURIComponent(map).split(',')

  let fullText: string | undefined

  const selectedFacets: SelectedFacet[] =
    queryValues.length >= mapValues.length
      ? mapValues.map((mapValue: string, i: number): SelectedFacet => {
          if (mapValue === 'ft') {
            try {
              fullText = decodeURI(queryValues[i])
            } catch {
              fullText = queryValues[i]
            }
          }

          return {
            key: mapValues[i],
            value: queryValues[i],
          }
        })
      : []

  if (priceRange) {
    selectedFacets.push({
      key: 'priceRange',
      value: priceRange,
    })
  }

  return [selectedFacets, fullText]
}

const addMap = (facet: CompatibilityFacetValue): void => {
  facet.map = facet.key

  if (facet.children) {
    facet.children.forEach((facetChild: CompatibilityFacetValue) => addMap(facetChild))
  }
}

const getFormattedDeliveries = (deliveries: CompatibilityFacet[]): CompatibilityFacet[] => {
  const shippingFacet: CompatibilityFacet | undefined = deliveries.find((d: CompatibilityFacet) => d.name === SHIPPING_KEY)

  if (!shippingFacet) {
    return [...deliveries, shippingFacetDefault]
  }

  const facetsNotIncluded: CompatibilityFacetValue[] = shippingFacetDefault.facets.filter((facet: CompatibilityFacetValue) =>
    shippingFacet.facets.every((f: CompatibilityFacetValue) => f.value !== facet.value)
  )

  shippingFacet.facets = [...shippingFacet.facets, ...facetsNotIncluded]

  return deliveries.map((facet: CompatibilityFacet) =>
    facet.name === SHIPPING_KEY ? shippingFacet : facet
  )
}

export const detachFiltersByType = (facets: CompatibilityFacet[]): DetachedFilters => {
  facets.forEach((facet: CompatibilityFacet) => facet.facets.forEach((value: CompatibilityFacetValue) => addMap(value)))

  // Group by type using native JavaScript
  const groupedFilters: GroupedFilters = facets.reduce((acc: GroupedFilters, filter: CompatibilityFacet) => {
    const type = filter.type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type]!.push(filter)
    return acc
  }, {})
  const brands: CompatibilityFacetValue[] = groupedFilters.BRAND?.[0]?.facets || []
  const brandsQuantity: number =
    groupedFilters &&
    groupedFilters.BRAND &&
    groupedFilters.BRAND[0] &&
    groupedFilters.BRAND[0].quantity != null
      ? groupedFilters.BRAND[0].quantity
      : 0

  const specificationFilters: CompatibilityFacet[] = (groupedFilters.NUMBER || []).concat(
    groupedFilters.TEXT || []
  )

  const deliveries: CompatibilityFacet[] = getFormattedDeliveries(groupedFilters.DELIVERY || [])

  const categoriesTrees: CompatibilityFacetValue[] = groupedFilters.CATEGORYTREE?.[0]?.facets || []

  const priceRanges: CompatibilityPriceRange[] = (groupedFilters.PRICERANGE?.[0]?.facets || []).map((facet: CompatibilityFacetValue): CompatibilityPriceRange => {
    const priceRange = facet as unknown as CompatibilityPriceRange
    return {
      ...priceRange,
      slug: `de-${priceRange.range.from}-a-${priceRange.range.to}`,
    }
  })

  return {
    brands,
    brandsQuantity,
    specificationFilters,
    categoriesTrees,
    priceRanges,
    deliveries,
  }
}

export const buildQueryArgsFromSelectedFacets = (selectedFacets: SelectedFacet[]): QueryArgs => {
  return selectedFacets.reduce(
    (queryArgs: QueryArgs, facet: SelectedFacet, index: number): QueryArgs => {
      queryArgs.query += `${index > 0 ? '/' : ''}${facet.value}`
      queryArgs.map += `${index > 0 ? ',' : ''}${facet.key}`

      return queryArgs
    },
    { query: '', map: '' }
  )
}
