"use client";
import React from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { Card } from "@/components/ui/card";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../../theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useOrganization } from "@clerk/nextjs";

const DesktopNav = () => {
  const paths = useNavigation();
  const { organization } = useOrganization();
  return (
    <Card className="hidden lg:flex lg:flex-col lg:items-center lg:justify-between lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <nav>
        <ul className="flex flex-col items-center gap-4">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Link href={path.href}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="icon"
                      variant={path.active ? "default" : "outline"}
                    >
                      {path.icon}
                    </Button>
                    {path.count ? (
                      <Badge className="absolute left-6 bottom-7 px-2">
                        {path.count}
                      </Badge>
                    ) : null}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{path.name}</p>
                    {organization && <p>Current: {organization.name}</p>}
                  </TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        <UserButton />
 
      </div>
    </Card>
  );
};

export default DesktopNav;
