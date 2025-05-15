export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { PortalBanner } from '@/components/portal/banner'
import React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col md:h-screen">
      <PortalBanner />
      <div className="container flex justify-center flex-1 h-0 mt-12">
        {children}
      </div>
    </div>
  )
}

export default Layout
