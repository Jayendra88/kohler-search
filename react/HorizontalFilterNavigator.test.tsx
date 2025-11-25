import React from 'react'
import { render } from '@vtex/test-tools/react'

import HorizontalFilterNavigator from './HorizontalFilterNavigator'

// Mock the search page context
jest.mock('vtex.search-page-context/SearchPageContext', () => ({
  useSearchPage: () => ({
    searchQuery: {
      data: {
        facets: {
          brands: [
            { id: '1', name: 'Brand A', value: 'brand-a', quantity: 10, selected: false },
            { id: '2', name: 'Brand B', value: 'brand-b', quantity: 5, selected: false }
          ],
          specificationFilters: [
            {
              name: 'Color',
              facets: [
                { id: '1', name: 'Red', value: 'red', quantity: 8, selected: false },
                { id: '2', name: 'Blue', value: 'blue', quantity: 12, selected: false }
              ]
            }
          ],
          categoriesTrees: [],
          priceRanges: []
        }
      }
    },
    map: 'c,b',
    showFacets: true,
    navigateToFacet: jest.fn()
  })
}))

describe('HorizontalFilterNavigator', () => {
  test('renders filter dropdowns', () => {
    const { getByText } = render(<HorizontalFilterNavigator />)

    expect(getByText('Brands')).toBeInTheDocument()
    expect(getByText('Color')).toBeInTheDocument()
  })

  test('shows loading state when no data', () => {
    // Override the mock for this test
    jest.doMock('vtex.search-page-context/SearchPageContext', () => ({
      useSearchPage: () => ({
        searchQuery: null,
        map: 'c,b',
        showFacets: true,
        navigateToFacet: jest.fn()
      })
    }))

    const { getByText } = render(<HorizontalFilterNavigator />)
    expect(getByText('Loading filters...')).toBeInTheDocument()
  })

  test('returns null when showFacets is false', () => {
    jest.doMock('vtex.search-page-context/SearchPageContext', () => ({
      useSearchPage: () => ({
        searchQuery: { data: { facets: {} } },
        map: 'c,b',
        showFacets: false,
        navigateToFacet: jest.fn()
      })
    }))

    const { container } = render(<HorizontalFilterNavigator />)
    expect(container.firstChild).toBeNull()
  })
})