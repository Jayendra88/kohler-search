import React, { useCallback, useMemo } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import FacetCheckbox from './FacetCheckbox'
import SelectedFilters from './SelectedFilters'
import { useFacetNavigation, useFilterState } from '../../hooks'
import { FacetGroup, FacetItem } from '../../types'
import { newFacetPathName } from '../../utils/slug'

const CSS_HANDLES = ['filterNavigatorVertical', 'filterGroupVertical', 'filterGroupTitle']

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

interface FilterNavigatorVerticalProps {
  facetGroups: FacetGroup[]
  facets: any
}

const FilterNavigatorVertical = ({
  facetGroups,
  facets,
}: FilterNavigatorVerticalProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { selectedFilterValues, updateSelection } = useFilterState(facetGroups)

  const { brands, priceRanges, specificationFilters, categoriesTrees } = facets

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
      // Update local state
      updateSelection(facet.value, facet.selected)

      // Navigate using the navigation service
      navigateToFacet({ ...facet }, false)
    },
    [navigateToFacet, updateSelection]
  )

  // Collect all selected facets from all groups
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
      // Find the facet type and key for the value
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

  return (
    <div className={`${handles.filterNavigatorVertical} flex flex-column`}>
      {/* Display selected filters at the top */}
      {allSelectedFacets.length > 0 && (
        <div className="mb4">
          <SelectedFilters
            selectedFacets={allSelectedFacets}
            onRemoveFilter={handleRemoveFilter}
          />
        </div>
      )}

      {/* Display all filter groups vertically */}
      {facetGroups.map((group, index) => (
        <div
          key={`${group.type}-${group.key || index}`}
          className={`${handles.filterGroupVertical} mb4`}
        >
          <h4 className={`${handles.filterGroupTitle} t-heading-6 mb3`}>
            {group.name}
          </h4>
          <div className="flex flex-column">
            {group.facets.map((facet) => {
              const isSelected = selectedFilterValues.has(facet.value)

              return (
                <div key={facet.id} className="mb2">
                  <FacetCheckbox
                    facet={facet}
                    isSelected={isSelected}
                    onChange={handleSelectionChange}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FilterNavigatorVertical
