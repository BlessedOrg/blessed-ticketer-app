import { ChevronLeft, Scan } from "lucide-react";
import { Card } from "@/components/ui/card";
import { QRScanner } from "@/components/dashboard/tabs/management/qrScanner/QrScanner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserContext } from "@/store/UserContext";

export const EventManagement = ({ eventId }) => {
  const { userEventsPermissions } = useUserContext();

  const eventData = userEventsPermissions.find((event) => event.id === eventId);
  return (
    <div className="px-4 w-full flex-col flex gap-4">
      <Button variant="green" asChild>
        <Link href={"/?tab=management"} className="flex items-center gap-2 w-fit">
          <ChevronLeft />
          <p>Back to events</p>
        </Link>
      </Button>
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-none mb-8">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Scan className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-bold text-gray-900">{eventData?.name + " -"} Ticket Scanner</h3>
          </div>
          <p className="text-gray-600">
            Scan QR codes to verify tickets and manage event entry
          </p>
        </div>
      </Card>
      <QRScanner />
    </div>
  );
};