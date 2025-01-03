"use client";
import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useUserContext } from "@/store/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingTicketsSkeleton } from "@/components/dashboard/tabs/ownedTickets/LoadingTicketsSkeleton";
import { EventManageCard } from "@/components/dashboard/tabs/management/events/EventManageCard";

export const ListOfEventsToManage = () => {
  const { userEventsPermissions, isLoading } = useUserContext();

  return <div className="w-full">
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-none mb-8">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Ticket className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-900">List of events you have access to management</h3>
        </div>
        <p className="text-gray-600">
          Select event and let peeps in
        </p>
      </div>
    </Card>

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
          {!!userEventsPermissions?.length ? (
            userEventsPermissions.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <EventManageCard event={event} />
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
  </div>;
};

