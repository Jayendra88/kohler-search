import React, { useMemo } from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'

import { LoadingPlaceholder } from './components/filterNavigator/index'
import { FacetTransformer } from './utils'
import FilterNavigator from './components/filterNavigator/FilterNavigator'
import FilterNavigatorContext from './components/filterNavigator/FilterNavigatorContext'
import './horizontalFilterNavigator.css'

const CSS_HANDLES = ['horizontalFilterNavigatorContainer']

const HorizontalFilterNavigator = () => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { searchQuery, map, showFacets } = useSearchPage()

  const facetGroups = useMemo(() => {
    return FacetTransformer.transformAllFacets(searchQuery?.data?.facets || {})
  }, [searchQuery?.data?.facets])

  const facets =
    searchQuery && searchQuery.data && searchQuery.data.facets
      ? searchQuery.data.facets
      : {}

  const { queryArgs } = facets

  if (showFacets === false || !map || facetGroups.length === 0) {
    return null
  }

  if (!searchQuery?.data) {
    return <LoadingPlaceholder />
  }

  return (
    <div
      className={`${handles.horizontalFilterNavigatorContainer} flex flex-column horizontal-filter-navigator-container`}
    >
      <FilterNavigatorContext.Provider value={queryArgs}>
        <FilterNavigator facets={facets} facetGroups={facetGroups} />
      </FilterNavigatorContext.Provider>
    </div>
  )
}

export default HorizontalFilterNavigator
