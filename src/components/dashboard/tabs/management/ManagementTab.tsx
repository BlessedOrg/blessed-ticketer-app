"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Settings, Ticket } from "lucide-react";
import { useUserContext } from "@/store/UserContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingTicketsSkeleton } from "@/components/dashboard/tabs/ownedTickets/LoadingTicketsSkeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ManagementTab = () => {
  const { userEventsPermissions, isLoading } = useUserContext();

  return <div className="w-full">
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-none mb-8">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Ticket className="w-6 h-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">List of events you have access to management</h1>
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

const EventManageCard = ({ event }) => {
  const isUpcoming = new Date(event.startsAt) > new Date();
  const isOngoing =
    new Date(event.startsAt) <= new Date() &&
    new Date(event.endsAt) >= new Date();
  const isPast = new Date(event.endsAt) < new Date();

  const getEventStatus = () => {
    if (isOngoing) return <Badge className="bg-green-500">Ongoing</Badge>;
    if (isUpcoming) return <Badge className="bg-blue-500">Upcoming</Badge>;
    if (isPast) return <Badge className="bg-gray-500">Past</Badge>;
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{event.name}</h2>
                {getEventStatus()}
                <Badge variant="outline" className="border-green-500 text-green-600 uppercase font-bold">
                  <Settings className="w-3 h-3 mr-1" />
                  Bouncer
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(event.startsAt), "MMM d, yyyy")} -{" "}
                    {format(new Date(event.endsAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(event.startsAt), "HH:mm")} -{" "}
                    {format(new Date(event.endsAt), "HH:mm")}
                  </span>
                </div>
                {event.EventLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {[
                        event.EventLocation.city,
                        event.EventLocation.country
                      ].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button className="self-end" variant="green" asChild>
              <Link href={`/?tab=${event.id}`} className="flex gap-2 items-center">
                <Settings />
                <p>Manage</p>
              </Link>
            </Button>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};