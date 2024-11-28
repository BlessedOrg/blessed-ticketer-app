import { Card, CardContent } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { OwnedEventCard } from "@/components/dashboard/tabs/ownedTickets/OwnedEventCard";
import useSWR from "swr";
import { apiUrl } from "@/variables/varaibles";
import { fetcherWithToken } from "@/requests/requests";
import { isArray } from "lodash";
import { LoadingTicketsSkeleton } from "@/components/dashboard/tabs/ownedTickets/LoadingTicketsSkeleton";
import { AnimatePresence, motion } from "framer-motion";

export function OwnedTicketsView() {
  const { data, isLoading } = useSWR(`${apiUrl}/private/tickets/owned`, fetcherWithToken);
  const ownedTickets = (isArray(data) ? data : []) as IEventWithTickets[];

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-none mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="w-6 h-6 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
            </div>
            <p className="text-gray-600">
              View and manage all your event tickets in one place
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingTicketsSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {ownedTickets.length > 0 ? (
              ownedTickets.map((eventWithTickets) => (
                <motion.div
                  key={eventWithTickets.event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <OwnedEventCard eventWithTickets={eventWithTickets} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-12">
                  <div className="text-center">
                    <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tickets yet
                    </h3>
                    <p className="text-gray-500">
                      You haven't purchased any tickets for upcoming events
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}