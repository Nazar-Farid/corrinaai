export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import {
  onDomainCustomerResponses,
  onGetAllDomainBookings,
} from '@/actions/appointment'
import PortalForm from '@/components/forms/portal/portal-form'
import React from 'react'

const CustomerSignUpForm = async ({
  params,
}: {
  params: { domainid: string; customerid: string }
}) => {
  const questions = await onDomainCustomerResponses(params.customerid)
  const bookings = await onGetAllDomainBookings(params.domainid)

  if (!questions || !questions.email || !questions.questions) {
    return <p>Required data is missing.</p>
  }

  return (
    <PortalForm
      bookings={bookings || []}
      email={questions.email}
      domainid={params.domainid}
      customerId={params.customerid}
      questions={questions.questions}
      type="Appointment"
    />
  )
}

export default CustomerSignUpForm
