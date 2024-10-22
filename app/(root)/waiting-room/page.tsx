"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function WaitingRoomPage() {
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <Card className="w-full">
    <CardHeader>
      <CardTitle>Waiting Room</CardTitle>
    </CardHeader>
    <CardContent>
      <p>You are either awaiting an organization assignment, or you need to pick an organization from the top right.</p>
      <p>Personal accounts are not supported at this time.</p>
    </CardContent>
  </Card>
}
