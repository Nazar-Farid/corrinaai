export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { onGetCurrentDomainInfo } from '@/actions/settings'
import BotTrainingForm from '@/components/forms/settings/bot-training'
import SettingsForm from '@/components/forms/settings/form'
import InfoBar from '@/components/infobar'
import ProductTable from '@/components/products'
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
  params: { domain: string }
}

const DomainSettingsPage = async ({ params }: Props) => {
  try {
    if (!params?.domain) {
      console.error('No domain param provided')
      redirect('/dashboard')
    }

    const domain = await onGetCurrentDomainInfo(params.domain)

    if (
      !domain ||
      !domain.subscription?.plan ||
      !domain.domains ||
      domain.domains.length === 0
    ) {
      console.error('Invalid domain data:', domain)
      redirect('/dashboard')
    }

    const domainInfo = domain.domains[0]

    return (
      <>
        <InfoBar />
        <div className="overflow-y-auto w-full chat-window flex-1 h-0">
          <SettingsForm
            plan={domain.subscription.plan as 'STANDARD' | 'PRO' | 'ULTIMATE'}
            chatBot={domainInfo.chatBot}
            id={domainInfo.id}
            name={domainInfo.name}
          />
          <BotTrainingForm id={domainInfo.id} />
          <ProductTable
            id={domainInfo.id}
            products={domainInfo.products || []}
          />
        </div>
      </>
    )
  } catch (error) {
    console.error('Error loading domain settings page:', error)
    redirect('/dashboard')
  }
}

export default DomainSettingsPage
