"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function WaitingRoomPage() {
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
