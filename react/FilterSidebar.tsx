import React, { useState, useMemo } from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'

import { LoadingPlaceholder } from './components/filterNavigator/index'
import { FacetTransformer } from './utils'
import Sidebar from './components/Sidebar'
import FilterNavigatorVertical from './components/filterNavigator/FilterNavigatorVertical'
import FilterNavigatorContext from './components/filterNavigator/FilterNavigatorContext'
import './filterSidebar.css'

const CSS_HANDLES = [
  'filterSidebarButton',
  'filterSidebarButtonText',
  'filterSidebarButtonIcon',
  'filterSidebarFooter',
  'filterSidebarClearButton',
  'filterSidebarApplyButton',
]

const FilterSidebar = () => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { searchQuery, map, showFacets } = useSearchPage()
  const [isOpen, setIsOpen] = useState(false)

  const facetGroups = useMemo(() => {
    return FacetTransformer.transformAllFacets(searchQuery?.data?.facets || {})
  }, [searchQuery?.data?.facets])

  const facets =
    searchQuery && searchQuery.data && searchQuery.data.facets
      ? searchQuery.data.facets
      : {}

  const { queryArgs } = facets

  // Don't show if facets are disabled or no facets available
  if (showFacets === false || !map || facetGroups.length === 0) {
    return null
  }

  if (!searchQuery?.data) {
    return <LoadingPlaceholder />
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleApply = () => {
    setIsOpen(false)
  }

  const handleClear = () => {
    // Clear logic will be handled by FilterNavigatorVertical
    setIsOpen(false)
  }

  return (
    <>
      {/* All Filters Button */}
      <button
        className={`${handles.filterSidebarButton} pointer flex items-center`}
        onClick={handleOpen}
      >
        <span className={`${handles.filterSidebarButtonIcon} mr2`}>
          {/* Filter Icon - Sliders */}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="4" y1="4" x2="12" y2="4" />
            <circle cx="6" cy="4" r="1.5" fill="currentColor" stroke="none" />
            <line x1="4" y1="8" x2="12" y2="8" />
            <circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none" />
            <line x1="4" y1="12" x2="12" y2="12" />
            <circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className={`${handles.filterSidebarButtonText}`}>
          All Filters
        </span>
      </button>

      {/* Sidebar Modal */}
      <Sidebar isOpen={isOpen} onOutsideClick={handleClose} fullWidth={false}>
        <FilterNavigatorContext.Provider value={queryArgs}>
          {/* Scrollable Filter Content */}
          <div className="flex-auto overflow-y-auto pa4 pb0">
            <h3 className="t-heading-5 mb4">Filters</h3>
            <FilterNavigatorVertical
              facets={facets}
              facetGroups={facetGroups}
            />
          </div>

          {/* Footer with Clear and Apply buttons - stays at bottom */}
          <div
            className={`${handles.filterSidebarFooter} bt b--muted-5 items-center flex bg-base pa3`}
          >
            <button
              className={`${handles.filterSidebarClearButton} flex-auto mr2 ph4 pv3 bn bg-muted-5 br2 pointer`}
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className={`${handles.filterSidebarApplyButton} flex-auto ml2 ph4 pv3 bn bg-action-primary c-on-action-primary br2 pointer`}
              onClick={handleApply}
            >
              Apply Filters
            </button>
          </div>
        </FilterNavigatorContext.Provider>
      </Sidebar>
    </>
  )
}

export default FilterSidebar
