"use client";

import { CheckCircle2, QrCode, Ticket as TicketIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ViewTicketModal } from "@/components/dashboard/tabs/ownedTickets/ViewTicketModal";

interface OwnedTicketRowProps {
  ticketData: IOwnedTicketOfEvent;
  eventData: IEvent;
}

export function OwnedTicketRow({ ticketData, eventData }: OwnedTicketRowProps) {
  const { ticket, ownedTokenIds, usedTokenIds, qrCodesPerToken } = ticketData;

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
          {ticket.metadataPayload?.metadataImageUrl ? (
            <Image
              src={ticket.metadataPayload.metadataImageUrl}
              alt={ticket.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <TicketIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 truncate">
              {ticket.name}
            </h4>
            <Badge variant="outline" className="text-xs">
              {ticket.metadataPayload.symbol}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {ticket.metadataPayload.description || "No description available"}
          </p>
          <div className="flex gap-2 mt-2">
            {ownedTokenIds.map((tokenId) => (
              <TooltipProvider key={tokenId}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <Badge
                      variant={usedTokenIds.includes(tokenId) ? "secondary" : "outline"}
                      className="flex items-center gap-1"
                    >
                      #{tokenId}
                      {usedTokenIds.includes(tokenId) && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 ml-1" />
                      )}
                      {!usedTokenIds.includes(tokenId) && (
                        <QrCode className="w-5 h-5 text-green-500 ml-1" />
                      )}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {usedTokenIds.includes(tokenId)
                      ? "Ticket has been used"
                      : "Ticket available for use"
                    }
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ownedTokenIds.map((tokenId) => {
              const qrCode = JSON.stringify(qrCodesPerToken.find(i => i.tokenId === tokenId));
              return <ViewTicketModal key={tokenId} ticket={ticket} tokenId={tokenId} event={eventData} isUsed={usedTokenIds.includes(tokenId)} qrCode={qrCode} />;
            }
          )}
        </div>
      </div>
    </div>
  );
}