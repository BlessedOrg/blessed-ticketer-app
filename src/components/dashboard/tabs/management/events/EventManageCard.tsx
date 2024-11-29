import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Settings } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const EventManageCard = ({ event }) => {
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
                <h3 className="text-2xl font-bold text-gray-900">{event.name}</h3>
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