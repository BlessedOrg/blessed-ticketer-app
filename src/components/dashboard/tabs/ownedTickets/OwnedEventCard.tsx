"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DoorOpen, MapPin } from "lucide-react";
import { format } from "date-fns";
import { OwnedTicketRow } from "./OwnedTicketRow";

interface OwnedEventCardProps {
  eventWithTickets: IEventWithTickets;
}

export function OwnedEventCard({ eventWithTickets }: OwnedEventCardProps) {
  const { event, ownedTicketsOfEvent, hasEventEntry } = eventWithTickets;
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
          {/* Event Header */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{event.name}</h2>
                {getEventStatus()}
                {hasEventEntry && (
                  <Badge variant="outline" className="border-green-500 text-green-600 uppercase font-bold">
                    <DoorOpen className="w-3 h-3 mr-1" />
                    Entered
                  </Badge>
                )}
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
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Your Tickets</h3>
            <div className="divide-y">
              {ownedTicketsOfEvent.map((ticketData) => (
                <OwnedTicketRow
                  key={ticketData.ticket.id}
                  ticketData={ticketData}
                  eventData={event}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}