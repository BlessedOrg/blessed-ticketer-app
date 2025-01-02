"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, RotateCcw, Ticket, XCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { fetcherWithToken } from "@/requests/requests";
import { apiUrl } from "@/variables/envVaraibles";

interface ScannedTicketInfoProps {
  data: {
    ticketId: string;
    tokenId: number;
    eventId: string;
  };
  onScanAgain: () => void;
}

export function ScannedTicketInfo({
  data, onScanAgain
}: ScannedTicketInfoProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    status: "success" | "error";
    message?: string;
  } | null>(null);

  const handleVerifyTicket = async () => {
    setIsVerifying(true);
    try {
      const res = await fetcherWithToken(`${apiUrl}/private/tickets/verify`, {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (res?.success) {
        setVerificationStatus({
          status: "success",
          message: "Ticket verified successfully"
        });
      }
    } catch (error) {
      setVerificationStatus({
        status: "error",
        message: error?.message || "Failed to verify ticket"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium">Ticket ID</h3>
                <p className="text-sm text-gray-500">{data.ticketId}</p>
              </div>
            </div>
            <Badge variant={verificationStatus?.status === "success" ? "default" : "outline"}>
              Token #{data.tokenId}
            </Badge>
          </div>

          {verificationStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                verificationStatus?.status === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {verificationStatus?.status === "success" ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{verificationStatus.message}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>{verificationStatus.message}</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end border-t pt-4">
        <Button
          variant="outline"
          onClick={onScanAgain}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Scan Another
        </Button>
        <Button
          onClick={handleVerifyTicket}
          disabled={isVerifying || verificationStatus?.status === "success"}
          variant="green"
        >
          {isVerifying ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                ⭮
              </motion.div>
              Verifying...
            </>
          ) : (
            "Verify Ticket"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}