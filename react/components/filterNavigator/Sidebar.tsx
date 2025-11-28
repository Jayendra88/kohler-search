import React, { useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'sidebarOverlay',
  'sidebarContainer',
  'sidebarContent',
]

interface SidebarProps {
  isOpen: boolean
  onOutsideClick: () => void
  children: React.ReactNode
  fullWidth?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onOutsideClick,
  children,
  fullWidth = false,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Don't render if not open
  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Dark overlay */}
      <div
        className={`${handles.sidebarOverlay} fixed top-0 left-0 w-100 h-100 bg-base--inverted o-40 z-999`}
        onClick={onOutsideClick}
      />

      {/* Sidebar drawer */}
      <div
        className={`${handles.sidebarContainer} fixed top-0 right-0 h-100 bg-base shadow-2 z-9999 flex flex-column ${
          fullWidth ? 'w-100' : 'w-40'
        }`}
        style={{
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </>
  )
}

export default Sidebar
