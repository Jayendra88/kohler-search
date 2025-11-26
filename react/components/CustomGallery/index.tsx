/* eslint-disable no-console */
import React from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ProductListContext } from 'vtex.product-list-context'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ProductContextProvider } from 'vtex.product-context'

import ProductTable from '../ProductTable'
import ProductTableRow from '../ProductTableRow'

interface CustomGalleryProps {
  products: Array<Record<string, unknown>>
}

const CustomGallery: React.FC<CustomGalleryProps> = ({ products }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ProductListProvider } = ProductListContext

  if (!products || products.length === 0) {
    return null
  }

  // ProductSummary blocks (product-summary-image, product-summary-brand, etc.)
  // automatically use the ProductSummary context when used via ExtensionPoint.
  // The ProductContextProvider provides the product context that these blocks need.
  // This is the proper way to use ProductSummary context with custom layouts.
  return (
    <ProductListProvider listName="Search result">
      <ProductTable>
        {products.map((product, index) => {
          console.log('product', product)
          const productId =
            (product.productId as string) ??
            (product.cacheId as string) ??
            String(index)

          // ProductContextProvider provides the product context that
          // ProductSummary ExtensionPoints (product-summary-*) need to function.
          // This is the standard VTEX pattern for providing product context
          // to ProductSummary blocks in custom components.
          return (
            <ProductContextProvider
              key={productId}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              product={product}
              query={{
                skuId: (product.items as Array<{ itemId: string }>)?.[0]
                  ?.itemId,
                slug: product.linkText as string,
              }}
            >
              <ProductTableRow />
            </ProductContextProvider>
          )
        })}
      </ProductTable>
    </ProductListProvider>
  )
}

export default CustomGallery
