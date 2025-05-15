import { onGetAllCampaigns, onGetAllCustomers } from '@/actions/mail'
import EmailMarketing from '@/components/email-marketing'
import InfoBar from '@/components/infobar'
import { currentUser } from '@clerk/nextjs'
import React from 'react'

const Page = async () => {
  const user = await currentUser()

  if (!user) return null

  const customers = await onGetAllCustomers(user.id)
  const campaigns = await onGetAllCampaigns(user.id)

  const campaign = campaigns?.campaign || []
  const subscription = customers?.subscription || null
  const domains = customers?.domains || []

  return (
    <>
      <InfoBar />
      <EmailMarketing
        campaign={campaign}
        subscription={subscription}
        domains={domains}
      />
    </>
  )
}

export const dynamic = 'force-dynamic'
export default Page
