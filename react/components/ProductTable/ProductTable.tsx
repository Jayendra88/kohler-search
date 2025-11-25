import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { ExtensionPoint } from 'vtex.render-runtime'
import './ProductTable.css'

const CSS_HANDLES = [
  'productTableWrapper',
  'productTable',
  'tableHeader',
  'tableHeaderRow',
  'tableHeaderCell',
  'tableBody',
] as const

interface ProductTableWrapperProps {
  children?: React.ReactNode
}

const ProductTableWrapper: React.FC<ProductTableWrapperProps> = () => {
  const handles = (useCssHandles(CSS_HANDLES) as unknown) as Record<
    typeof CSS_HANDLES[number],
    string
  >

  return (
    <div className={handles.productTableWrapper}>
      <table className={handles.productTable}>
        <thead className={handles.tableHeader}>
          <tr className={handles.tableHeaderRow}>
            <th className={handles.tableHeaderCell}>Compare</th>
            <th className={handles.tableHeaderCell}>SKU</th>
            <th className={handles.tableHeaderCell}>Products</th>
            <th className={handles.tableHeaderCell}>Status</th>
            <th className={handles.tableHeaderCell}>List Price</th>
            <th className={handles.tableHeaderCell}>Favorite</th>
            <th className={handles.tableHeaderCell}>Service Parts Diagram</th>
            <th className={handles.tableHeaderCell}>Share</th>
          </tr>
        </thead>
        <tbody className={handles.tableBody}>
          <ExtensionPoint id="gallery" />
        </tbody>
      </table>
    </div>
  )
}

export default ProductTableWrapper
