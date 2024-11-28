"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Camera, CheckCircle2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ScannedTicketInfo } from "./ScannedTicketInfo";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { CameraSelect } from "./CameraSelect";

export function QRScanner() {
  const [enabledScanner, setEnabledScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices)) {
      setError("Your browser does not support camera access");
    }
  }, []);

  const startScanning = async () => {
    try {
      setHasPermission(true);
      setIsScanning(true);
      setEnabledScanner(true);
      setError(null);

      if (videoRef.current && reader) {
        const constraints = {
          audio: false,
          video: selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : { facingMode: "environment" }
        };

        const controls = await reader.current.decodeFromConstraints(
          constraints,
          videoRef.current,
          (result, error) => {
            if (result) {
              try {
                const ticketData = result.getText();
                setScannedData(JSON.parse(ticketData));
                setIsScanning(false);
                stopScanning();
              } catch (e) {
                setError("Invalid QR code format");
              }
            }
            if (error && error.message !== "No MultiFormat Readers were able to detect the code.") {
              console.error("Scanning error:", error);
            }
          }
        );
        controlsRef.current = controls;
      }
    } catch (err) {
      handleScanningError(err);
    }
  };

  const handleScanningError = (err: unknown) => {
    if (err instanceof Error) {
      if (err?.name === "NotAllowedError") {
        setHasPermission(false);
      } else {
        setError(`Failed to start camera: ${err?.message}`);
      }
    } else {
      setError("An unknown error occurred");
    }
    setIsScanning(false);
    setEnabledScanner(false);
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setEnabledScanner(false);
  };

  const resetScanner = () => {
    setScannedData(null);
    setError(null);
    startScanning();
  };

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (isScanning) {
      stopScanning();
      startScanning();
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {hasPermission === false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Camera Access Denied</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser settings and click retry.
                You may need to refresh the page after changing settings.
              </AlertDescription>
              <Button onClick={resetScanner} size="sm" className="mt-2">
                Retry
              </Button>
            </Alert>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {scannedData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">QR Code Scanned Successfully</AlertTitle>
              <AlertDescription className="text-green-700">
                Ticket information has been retrieved.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <ScannedTicketInfo data={scannedData} onScanAgain={resetScanner} />
            </div>
          </motion.div>
        )}

        {!scannedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="space-y-4">
              <CameraSelect
                onDeviceSelect={handleDeviceSelect}
                disabled={isScanning}
              />

              <Card className="overflow-hidden rounded-2xl">
                <div className="aspect-video relative bg-black p-[10px] rounded-2xl bg-gradient-to-l from-green-500 to-yellow-500">
                  <div className="aspect-video relative bg-black overflow-hidden  rounded-xl">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                      onLoadedMetadata={() => setEnabledScanner(false)}
                    />
                    {enabledScanner && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                        <p className="text-white">Initializing camera...</p>
                      </div>
                    )}
                    {!isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                        <Button onClick={startScanning} size="lg" variant="green">
                          <Camera className="w-5 h-5 mr-2" />
                          Start Scanning
                        </Button>
                      </div>
                    )}
                    {isScanning && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 border-4 border-white/20" />
                        <motion.div
                          className="absolute left-0 right-0 h-0.5 bg-blue-500"
                          initial={{ top: "0%" }}
                          animate={{ top: "100%" }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {isScanning && (
                  <div className="p-4 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={stopScanning}
                    >
                      Stop Scanning
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}