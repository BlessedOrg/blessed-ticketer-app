"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera } from "lucide-react";

interface CameraDevice {
  deviceId: string;
  label: string;
}

interface CameraSelectProps {
  onDeviceSelect: (deviceId: string) => void;
  disabled?: boolean;
}

export function CameraSelect({ onDeviceSelect, disabled }: CameraSelectProps) {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
          .filter(device => device.kind === "videoinput")
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${devices.indexOf(device) + 1}`
          }));
        setDevices(videoDevices);

        // Select the first device by default
        if (videoDevices.length > 0 && !selectedDevice) {
          setSelectedDevice(videoDevices[0].deviceId);
          onDeviceSelect(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error getting camera devices:", error);
      }
    };

    getDevices();
  }, [onDeviceSelect, selectedDevice]);

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDevice(deviceId);
    onDeviceSelect(deviceId);
  };

  if (devices.length <= 1) return null;

  return (
    <Select
      value={selectedDevice}
      onValueChange={handleDeviceChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <SelectValue placeholder="Select camera" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {devices.map((device) => (
          <SelectItem key={device.deviceId} value={device.deviceId}>
            {device.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}