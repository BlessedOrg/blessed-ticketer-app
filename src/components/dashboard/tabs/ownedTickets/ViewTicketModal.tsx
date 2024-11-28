"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Download, ExternalLink, Loader2, MapPin, Ticket as TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

interface ViewTicketModalProps {
  ticket: ITicket;
  tokenId: number;
  event: IEvent;
  isUsed: boolean;
}

export function ViewTicketModal({
  ticket,
  tokenId,
  event,
  isUsed
}: ViewTicketModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const ticketData = JSON.stringify({
    ticketId: ticket.id,
    tokenId,
    eventId: event.id
  });

  const convertSVGToCanvas = async (svg: SVGSVGElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      canvas.width = svg.width.baseVal.value * 2;
      canvas.height = svg.height.baseVal.value * 2;

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (ctx) {
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0);
        }
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = reject;
      img.src = url;
    });
  };

  const loadEventImage = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 297]
      });

      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, 210, 297, "F");

      if (ticket.metadataPayload?.metadataImageUrl) {
        try {
          const imageData = await loadEventImage(ticket.metadataPayload.metadataImageUrl);
          pdf.addImage(imageData, "JPEG", 0, 0, 210, 60, undefined, "FAST");

          pdf.setFillColor(0, 0, 0);
          const gradient = pdf.setFillColor(0, 0, 0);
          pdf.setGState(pdf.GState({ opacity: 0.5 }));
          pdf.rect(0, 0, 210, 60, "F");
          pdf.setGState(pdf.GState({ opacity: 1 }));
        } catch (error) {
          console.error("Error loading event image:", error);
        }
      }

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.text(event.name, 20, 35);

      pdf.setFontSize(16);
      pdf.text(ticket.name, 20, 45);

      pdf.setTextColor(0, 0, 0);

      pdf.setFontSize(14);
      pdf.setTextColor(71, 85, 105);

      const startY = 80;
      const lineHeight = 10;

      pdf.text(`Date: ${format(new Date(event.startsAt), "PPPP")}`, 20, startY);
      pdf.text(`Time: ${format(new Date(event.startsAt), "p")} - ${format(new Date(event.endsAt), "p")}`, 20, startY + lineHeight);

      if (event.EventLocation) {
        pdf.text(
          `Location: ${event.EventLocation.city}, ${event.EventLocation.country}`,
          20,
          startY + lineHeight * 2
        );
      }

      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Ticket #${tokenId}`, 20, startY + lineHeight * 4);

      if (ticket.metadataPayload?.description) {
        pdf.setFontSize(12);
        pdf.setTextColor(71, 85, 105);
        const description = pdf.splitTextToSize(ticket.metadataPayload.description, 170);
        pdf.text(description, 20, startY + lineHeight * 6);
      }

      const qrSvg = qrRef.current?.querySelector("svg");
      if (qrSvg) {
        const qrDataUrl = await convertSVGToCanvas(qrSvg);
        const qrSize = 80;
        const pageWidth = 210;
        const qrX = (pageWidth - qrSize) / 2;
        pdf.addImage(qrDataUrl, "PNG", qrX, 160, qrSize, qrSize);

        pdf.setFontSize(12);
        pdf.setTextColor(71, 85, 105);
        pdf.text("Scan to verify ticket", pageWidth / 2, 250, { align: "center" });
      }

      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184);
      pdf.text(
        "This ticket is unique and valid for one-time entry only.",
        105,
        285,
        { align: "center" }
      );
      pdf.text(
        `Generated on ${format(new Date(), "PPP")}`,
        105,
        290,
        { align: "center" }
      );

      pdf.save(`${event.slug}-ticket-${tokenId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          key={tokenId}
          variant="outline"
          size="sm"
          className="hidden sm:flex"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View #{tokenId}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-4xl">Ticket Details</DialogTitle>
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
                  ref={qrRef}
                >
                  <QRCodeSVG
                    value={ticketData}
                    size={200}
                    level="H"
                    includeMargin
                  />
                  {isUsed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Used
                      </Badge>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="text-center">
                <h3 className="font-semibold text-lg">{ticket.name}</h3>
                <p className="text-sm text-gray-500">Token #{tokenId}</p>
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

          <Button
            className="w-full"
            variant="green"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}