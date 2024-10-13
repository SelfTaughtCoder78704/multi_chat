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

const DotIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  )
}

const CustomPage = () => {
  return (
    <div>
      <h1>Custom Organization Profile Page</h1>
      <p>This is the custom organization profile page</p>
    </div>
  )
}


const DesktopNav = () => {
  const paths = useNavigation();
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
                  </TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/organizations">
              <Button>Organizations</Button>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        {/* <UserButton /> */}
        <OrganizationSwitcher>
      {/* You can pass the content as a component */}
      <OrganizationSwitcher.OrganizationProfilePage
        label="Custom Page"
        url="custom"
        labelIcon={<DotIcon />}
      >
        <CustomPage />
      </OrganizationSwitcher.OrganizationProfilePage>

      {/* You can also pass the content as direct children */}
      <OrganizationSwitcher.OrganizationProfilePage
        label="Terms"
        labelIcon={<DotIcon />}
        url="terms"
      >
        <div>
          <h1>Custom Terms Page</h1>
          <p>This is the custom terms page</p>
        </div>
      </OrganizationSwitcher.OrganizationProfilePage>
    </OrganizationSwitcher>
      </div>
    </Card>
  );
};

export default DesktopNav;
