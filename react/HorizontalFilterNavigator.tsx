import React, { useMemo, useState, useCallback } from 'react'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'

import { LoadingPlaceholder } from './components/filterNavigator/index'
import { FacetTransformer } from './utils'
import FilterDropdown from './components/filterNavigator/FilterDropdown'
import SelectedFilters from './components/filterNavigator/SelectedFilters'
import FilterNavigatorVertical from './components/filterNavigator/FilterNavigatorVertical'
import FilterNavigatorContext from './components/filterNavigator/FilterNavigatorContext'
import Sidebar from './components/Sidebar'
import { useFacetNavigation, useFilterState } from './hooks'
import { FacetItem } from './types'
import { newFacetPathName } from './utils/slug'
import './horizontalFilterNavigator.css'

const CSS_HANDLES = [
  'horizontalFilterNavigatorContainer',
  'filterNavigatorContainer',
  'filterSidebarButton',
  'filterSidebarButtonText',
  'filterSidebarButtonIcon',
  'filterSidebarFooter',
  'filterSidebarClearButton',
  'filterSidebarApplyButton',
]

const getSelectedCategories = (tree: any[]): any[] => {
  for (const node of tree) {
    if (!node.selected) {
      continue
    }

    if (node.children) {
      return [node, ...getSelectedCategories(node.children)]
    }

    return [node]
  }

  return []
}

const newNamedFacet = (facet: any) => {
  return { ...facet, newQuerySegment: newFacetPathName(facet) }
}

const flattenDeep = (arr: any[]): any[] => {
  return arr.reduce((accumulator, currentValue) => {
    return accumulator.concat(
      Array.isArray(currentValue) ? flattenDeep(currentValue) : currentValue
    )
  }, []) as any[]
}

const HorizontalFilterNavigator = () => {
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

  const { queryArgs, brands, priceRanges, specificationFilters, categoriesTrees } = facets

  const { selectedFilterValues, updateSelection } = useFilterState(facetGroups)

  const selectedFilters = useMemo(() => {
    const options = [
      ...specificationFilters.map((filter: any) => {
        return filter.facets.map((facet: any) => {
          return {
            ...newNamedFacet({ ...facet, title: filter.name }),
            hidden: filter.hidden,
          }
        })
      }),
      ...brands,
      ...priceRanges,
    ]

    return flattenDeep(options)
  }, [brands, priceRanges, specificationFilters]).filter(
    (facet: any) => facet.selected
  )

  const selectedCategories = getSelectedCategories(categoriesTrees || [])
  const navigateToFacet = useFacetNavigation(
    useMemo(() => {
      return selectedCategories.concat(selectedFilters)
    }, [selectedFilters, selectedCategories]),
    'none'
  )

  const handleSelectionChange = useCallback(
    (facet: FacetItem) => {
      updateSelection(facet.value, facet.selected)
      navigateToFacet({ ...facet }, false)
    },
    [navigateToFacet, updateSelection]
  )

  const allSelectedFacets = useMemo(() => {
    const selected: FacetItem[] = []

    facetGroups.forEach((group) => {
      group.facets.forEach((facet) => {
        if (selectedFilterValues.has(facet.value)) {
          selected.push(facet)
        }
      })
    })

    return selected
  }, [facetGroups, selectedFilterValues])

  const handleRemoveFilter = useCallback(
    (value: string) => {
      let selectedFacet = null

      facetGroups.forEach((group) => {
        selectedFacet = group.facets.find((f) => f.value === value)
      })

      if (selectedFacet) {
        handleSelectionChange(selectedFacet)
      }
    },
    [facetGroups, handleSelectionChange]
  )

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
    setIsOpen(false)
  }

  return (
    <FilterNavigatorContext.Provider value={queryArgs}>
      <div
        className={`${handles.horizontalFilterNavigatorContainer} flex flex-column horizontal-filter-navigator-container`}
      >
        {/* Filter Dropdowns + All Filters Button in same row */}
        <div className={`${handles.filterNavigatorContainer} flex flex-row flex-wrap items-center`}>
          {facetGroups.map((group, index) => (
            <FilterDropdown
              key={`${group.type}-${group.key || index}`}
              facetGroup={group}
              selectedValues={selectedFilterValues}
              onSelectionChange={handleSelectionChange}
            />
          ))}

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
        </div>

        {/* Selected Filters Display */}
        <SelectedFilters
          selectedFacets={allSelectedFacets}
          onRemoveFilter={handleRemoveFilter}
        />

        {/* Sidebar Modal */}
        <Sidebar isOpen={isOpen} onOutsideClick={handleClose} fullWidth={false}>
          <div className="flex-auto overflow-y-auto pa4 pb0">
            <h3 className="t-heading-5 mb4">Filters</h3>
            <FilterNavigatorVertical
              facets={facets}
              facetGroups={facetGroups}
            />
          </div>

          {/* Footer with Clear and Apply buttons */}
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
        </Sidebar>
      </div>
    </FilterNavigatorContext.Provider>
  )
}

export default HorizontalFilterNavigator
