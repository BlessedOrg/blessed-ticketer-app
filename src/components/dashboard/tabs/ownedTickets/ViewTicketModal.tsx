"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Loader2, MapPin, Ticket as TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import { fetcherWithToken } from "@/requests/requests";
import { apiUrl } from "@/variables/varaibles";

interface ViewTicketModalProps {
  ticket: ITicket;
  tokenId: number;
  event: IEvent;
  isUsed: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ViewTicketModal({
  ticket,
  tokenId,
  event,
  isUsed,
  isOpen,
  onOpenChange
}: ViewTicketModalProps) {
  const COUNTDOWN_DURATION = 10;

  const [refreshCountdown, setRefreshCountdown] = useState(COUNTDOWN_DURATION);
  const [currentQrCode, setCurrentQrCode] = useState(null);
  const [isQrExpired, setIsQrExpired] = useState(false);

  const {
    data: qrCodePayload,
    isLoading: isQRCodeLoading,
    isValidating,
    error: qrCodeError,
    mutate
  } = useSWR(`${apiUrl}/private/tickets/${event.id}/${ticket.id}/${tokenId}/qrcode`, fetcherWithToken, {
    refreshInterval: 0,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    onSuccess: (newPayload) => {
      if (newPayload?.code !== currentQrCode) {
        setCurrentQrCode(newPayload?.code);
        setIsQrExpired(false);
        setRefreshCountdown(COUNTDOWN_DURATION);
      }
    }
  });

  useEffect(() => {
    if (!currentQrCode && !isQRCodeLoading && !isValidating) {
      mutate();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          setIsQrExpired(true);
          mutate();
          return COUNTDOWN_DURATION;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [mutate]);

  const renderQRCode = () => {
    if (isQRCodeLoading) {
      return (
        <div className="w-[200px] h-[200px] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      );
    }

    if (qrCodeError) {
      return (
        <div className="w-[200px] h-[200px] flex items-center justify-center text-red-500">
          Error loading QR Code
        </div>
      );
    }

    return (
      <>
        <QRCodeSVG
          value={qrCodePayload?.code}
          size={200}
          level={"H"}
          includeMargin={false}
        />
        {(isUsed || isQrExpired) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              {isUsed ? "Used" : "Expired"}
            </Badge>
          </div>
        )}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" asChild>
            <h3>Ticket Details</h3>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="p-4" variant="classic">
            <div className="flex flex-col items-center space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key="qr-code"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  {renderQRCode()}
                </motion.div>
              </AnimatePresence>

              <div className="text-center">
                <h3 className="font-semibold text-lg">{ticket.name}</h3>
                <p className="text-sm text-gray-500">Token #{tokenId}</p>

                <div className="mt-2 text-xs text-gray-500 tabular-nums">
                  {isQrExpired
                    ? "Refreshing QR Code..."
                    : `Next refresh in ${refreshCountdown}s`}
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{
                        width: `${(refreshCountdown / COUNTDOWN_DURATION) * 100}%`,
                        transition: "width 0.5s linear"
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TicketIcon className="w-4 h-4" />
              <span>{event.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(event.startsAt), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(event.startsAt), "p")}</span>
            </div>
            {event.EventLocation && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {event.EventLocation.city}, {event.EventLocation.country}
                </span>
              </div>
            )}
          </div>
          <p className="font-bold text-center italic">
            Scan the QR code to enter the event.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}