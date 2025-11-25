import type { FacetNavigationPayload } from '../types';

/**
 * Handles URL navigation for facet selection changes
 */
export class NavigationService {
  public static buildFacetPayload(facetType: string, key: string | null, value: string): FacetNavigationPayload {
    return {
      type: facetType,
      value: value,
      ...(key && { key })
    };
  }

  public static navigateToFacet(
    navigateToFacet: ((payload: FacetNavigationPayload, selected: boolean) => void) | undefined,
    facetType: string,
    key: string | null,
    value: string,
    selected: boolean
  ): void {
    try {
      if (navigateToFacet) {
        const payload = this.buildFacetPayload(facetType, key, value);
        navigateToFacet(payload, selected);
      } else {
        this.fallbackNavigation(facetType, value, selected);
      }
    } catch (error) {
      console.error('Error navigating to facet:', error);
      // Fallback to manual URL construction on error
      this.fallbackNavigation(facetType, value, selected);
    }
  }

  private static fallbackNavigation(facetType: string, value: string, selected: boolean) {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    
    if (selected) {
      this.addFacetToUrl(params, facetType, value);
    } else {
      this.removeFacetFromUrl(params, value);
    }
    
    window.location.href = `${currentUrl.pathname}?${params.toString()}`;
  }

  private static addFacetToUrl(params: URLSearchParams, facetType: string, value: string) {
    const existingValues = params.get('map')?.split(',') || [];
    const existingQuery = params.get('query')?.split('/') || [];
    
    if (!existingQuery.includes(value)) {
      existingQuery.push(value);
      existingValues.push(facetType === 'brands' ? 'b' : 'c');
      
      params.set('query', existingQuery.join('/'));
      params.set('map', existingValues.join(','));
    }
  }

  private static removeFacetFromUrl(params: URLSearchParams, value: string) {
    const existingValues = params.get('map')?.split(',') || [];
    const existingQuery = params.get('query')?.split('/') || [];
    
    const valueIndex = existingQuery.indexOf(value);
    if (valueIndex > -1) {
      existingQuery.splice(valueIndex, 1);
      existingValues.splice(valueIndex, 1);
      
      if (existingQuery.length > 0) {
        params.set('query', existingQuery.join('/'));
        params.set('map', existingValues.join(','));
      } else {
        params.delete('query');
        params.delete('map');
      }
    }
  }
}