"use client";
import React from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { Card } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";



const DesktopNav = () => {
  const paths = useNavigation();
  return (
    <Card className="hidden lg:flex lg:flex-col lg:items-center lg:justify-between lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <div className="flex flex-col gap-4">
        <nav></nav>
        <div className="flex flex-col items-center gap-4">
          <UserButton />
        </div>
      </div>
    </Card>
  )
}

export default DesktopNav