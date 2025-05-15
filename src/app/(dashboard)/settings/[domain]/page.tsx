import { onGetCurrentDomainInfo } from '@/actions/settings'
import BotTrainingForm from '@/components/forms/settings/bot-training'
import SettingsForm from '@/components/forms/settings/form'
import InfoBar from '@/components/infobar'
import ProductTable from '@/components/products'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = { params: { domain: string } }

const DomainSettingsPage = async ({ params }: Props) => {
  const domain = await onGetCurrentDomainInfo(params.domain)

  // Redirect if domain info is missing or domain.domains is empty
  if (!domain || !domain.domains || domain.domains.length === 0) {
    redirect('/dashboard')
  }

  const currentDomain = domain.domains[0]
  const plan = domain.subscription?.plan ?? 'STANDARD' // Provide a default plan or handle accordingly
  const chatBot = currentDomain.chatBot ?? null
  const id = currentDomain.id ?? ''
  const name = currentDomain.name ?? ''
  const products = currentDomain.products ?? []

  return (
    <>
      <InfoBar />
      <div className="overflow-y-auto w-full chat-window flex-1 h-0">
        <SettingsForm
          plan={plan}
          chatBot={chatBot}
          id={id}
          name={name}
        />
        <BotTrainingForm id={id} />
        <ProductTable id={id} products={products} />
      </div>
    </>
  )
}

export default DomainSettingsPage
