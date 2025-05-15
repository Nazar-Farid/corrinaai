import { onGetAllBookingsForCurrentUser } from '@/actions/appointment'
import AllAppointments from '@/components/appointment/all-appointments'
import InfoBar from '@/components/infobar'
import Section from '@/components/section-label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'

type Props = {}

const Page = async (props: Props) => {
  const user = await currentUser()

  if (!user) return <div className="w-full text-center">Not authenticated</div>

  return (
    <>
      <InfoBar />
      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 h-0 gap-5">
        <div className="lg:col-span-2 overflow-y-auto">
          <Suspense fallback={<div>Loading appointments...</div>}>
            <AppointmentContent userId={user.id} />
          </Suspense>
        </div>
        <TodayBookingsSection userId={user.id} />
      </div>
    </>
  )
}

async function AppointmentContent({ userId }: { userId: string }) {
  const domainBookings = await onGetAllBookingsForCurrentUser(userId)
  return <AllAppointments bookings={domainBookings?.bookings || []} />
}

async function TodayBookingsSection({ userId }: { userId: string }) {
  const today = new Date()
  const domainBookings = await onGetAllBookingsForCurrentUser(userId)
  
  if (!domainBookings?.bookings?.length) {
    return (
      <div className="col-span-1">
        <Section
          label="Bookings For Today"
          message="All your bookings for today are mentioned below."
        />
        <div className="w-full flex justify-center p-4">
          <p>No appointments found</p>
        </div>
      </div>
    )
  }

  const bookingsExistToday = domainBookings.bookings.filter(
    (booking) => 
      booking.date.getDate() === today.getDate() &&
      booking.date.getMonth() === today.getMonth() &&
      booking.date.getFullYear() === today.getFullYear()
  )

  return (
    <div className="col-span-1">
      <Section
        label="Bookings For Today"
        message="All your bookings for today are mentioned below."
      />
      {bookingsExistToday.map((booking) => (
        <Card key={booking.id} className="rounded-xl overflow-hidden mt-4">
          {/* Keep existing card content */}
        </Card>
      ))}
    </div>
  )
}

// Add this to handle dynamic data requirements
export const dynamic = 'force-dynamic'

export default Page