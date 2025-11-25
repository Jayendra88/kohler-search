import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
// @ts-expect-error - useProductComparison exists at runtime but may not be in types
import { useProductComparison } from 'vtex.product-comparison'
import { ExtensionPoint } from 'vtex.render-runtime'
import './ProductTableRow.css'

const CSS_HANDLES = [
  'tableRow',
  'tableCell',
  'compareCell',
  'skuCell',
  'productCell',
  'statusCell',
  'priceCell',
  'favoriteCell',
  'servicePartsCell',
  'shareCell',
  'productInfo',
  'productImage',
  'productDetails',
] as const

const ProductTableRow: React.FC = () => {
  const handles = (useCssHandles(CSS_HANDLES) as unknown) as Record<
    typeof CSS_HANDLES[number],
    string
  >

  const product = useProduct()

  const { isProductSelected, toggleProduct } = useProductComparison()

  if (!product) {
    return null
  }

  const productId = product.product?.productId
  const isSelected = isProductSelected?.(productId)

  return (
    <tr className={handles.tableRow}>
      <td className={`${handles.tableCell} ${handles.compareCell}`}>
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={() => toggleProduct?.(productId)}
        />
        <ExtensionPoint id="check-permission#product-comparison-table" />
      </td>
      <td className={`${handles.tableCell} ${handles.skuCell}`}>
        <ExtensionPoint id="product-identifier.summary" />
      </td>
      <td className={`${handles.tableCell} ${handles.productCell}`}>
        <div className={handles.productInfo}>
          <div className={handles.productImage}>
            <ExtensionPoint id="product-summary-image#table" />
          </div>
          <div className={handles.productDetails}>
            <ExtensionPoint id="product-summary-brand" />
            <ExtensionPoint id="product-summary-name" />
          </div>
        </div>
      </td>
      <td className={`${handles.tableCell} ${handles.statusCell}`}>
        <ExtensionPoint id="product-specification-badges" />
      </td>
      <td className={`${handles.tableCell} ${handles.priceCell}`}>
        <ExtensionPoint id="check-permission#product-summary-price-table" />
      </td>
      <td className={`${handles.tableCell} ${handles.favoriteCell}`}>
        <ExtensionPoint id="add-to-list-btn#table" />
      </td>
      <td className={`${handles.tableCell} ${handles.servicePartsCell}`}>
        <ExtensionPoint id="rich-text#service-parts-placeholder" />
      </td>
      <td className={`${handles.tableCell} ${handles.shareCell}`}>
        <ExtensionPoint id="rich-text#share-placeholder" />
      </td>
    </tr>
  )
}

export default ProductTableRow
