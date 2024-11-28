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
  qrCode: string;
}

export function ViewTicketModal({
  ticket,
  tokenId,
  event,
  isUsed,
  qrCode
}: ViewTicketModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

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
        format: [210, 297] // A4
      });

      // Background
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, 210, 297, "F");

      // Header section with event image
      const headerHeight = 50;
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, 210, headerHeight, "F");

      if (ticket.metadataPayload?.metadataImageUrl) {
        try {
          const imageData = await loadEventImage(ticket.metadataPayload.metadataImageUrl);
          pdf.addImage(imageData, "JPEG", 0, 0, 210, headerHeight, undefined, "FAST");

          // Gradient overlay for better text visibility
          pdf.setFillColor(0, 0, 0);
          pdf.setGState(pdf.GState({ opacity: 0.6 }));
          pdf.rect(0, 0, 210, headerHeight, "F");
          pdf.setGState(pdf.GState({ opacity: 1 }));
        } catch (error) {
          console.error("Error loading event image:", error);
        }
      }

      // Event title and description
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text(event.name, 20, 30);

      if (event.description) {
        pdf.setFontSize(11);
        const description = pdf.splitTextToSize(event.description, 170);
        pdf.text(description, 20, 40);
      }

      // Event Details Section
      let currentY = headerHeight + 20;
      const sectionSpacing = 8;
      const lineHeight = 7;

      // Section Title: Event Details
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(14);
      pdf.text("Event Details", 20, currentY);
      currentY += sectionSpacing;

      // Event information
      pdf.setFontSize(11);
      pdf.setTextColor(71, 85, 105);

      // Date
      pdf.text("Date:", 20, currentY);
      pdf.text(
        `${format(new Date(event.startsAt), "PPPP")} - ${format(new Date(event.endsAt), "PPPP")}`,
        60, currentY
      );
      currentY += lineHeight;

      // Time
      pdf.text("Time:", 20, currentY);
      pdf.text(
        `${format(new Date(event.startsAt), "p")} - ${format(new Date(event.endsAt), "p")}`,
        60, currentY
      );
      currentY += lineHeight;

      // Timezone
      pdf.text("Timezone:", 20, currentY);
      pdf.text(event.timezoneIdentifier, 60, currentY);
      currentY += lineHeight;

      // Location
      if (event.EventLocation) {
        pdf.text("Location:", 20, currentY);
        pdf.text(
          `${event.EventLocation.city}, ${event.EventLocation.country}`,
          60, currentY
        );
        currentY += lineHeight;
      }

      currentY += sectionSpacing * 1.5;

      // Ticket Details Section
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(14);
      pdf.text("Ticket Details", 20, currentY);
      currentY += sectionSpacing;

      pdf.setFontSize(11);
      pdf.setTextColor(71, 85, 105);

      // Ticket information
      pdf.text("Ticket Type:", 20, currentY);
      pdf.text(ticket.name, 60, currentY);
      currentY += lineHeight;

      pdf.text("Token ID:", 20, currentY);
      pdf.text(`#${tokenId}`, 60, currentY);
      currentY += lineHeight;

      if (ticket.metadataPayload?.symbol) {
        pdf.text("Category:", 20, currentY);
        pdf.text(ticket.metadataPayload.symbol, 60, currentY);
        currentY += lineHeight;
      }

      currentY += sectionSpacing * 2;

      // QR Code Section
      const qrSvg = qrRef.current?.querySelector("svg");
      if (qrSvg) {
        const qrDataUrl = await convertSVGToCanvas(qrSvg);
        const qrSize = 70;
        const pageWidth = 210;
        const qrX = (pageWidth - qrSize) / 2;

        pdf.setTextColor(31, 41, 55);
        pdf.setFontSize(12);
        pdf.text("Scan QR Code for Entry", pageWidth / 2, currentY, { align: "center" });
        currentY += 8;

        pdf.addImage(qrDataUrl, "PNG", qrX, currentY, qrSize, qrSize);
        currentY += qrSize + 8;
      }

      // Footer
      const footerY = 270;
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);

      // Warning text
      pdf.setFont(undefined, "bold");
      pdf.text(
        "IMPORTANT: This QR code is for one-time use only. Do not share it with anyone.",
        105, footerY - 8,
        { align: "center" }
      );

      // Generation details
      pdf.setFont(undefined, "normal");
      pdf.text(
        `Generated on ${format(new Date(), "PPP 'at' pp")}`,
        105, footerY,
        { align: "center" }
      );

      pdf.text(
        `Ticket ID: ${ticket.id}`,
        105, footerY + 4,
        { align: "center" }
      );

      // Save the PDF
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
                    value={qrCode}
                    size={200}
                    level={"H"}
                    includeMargin={false}
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