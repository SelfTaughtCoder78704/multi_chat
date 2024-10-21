"use client";

import { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import OrgView from "@/components/shared/organization/OrgView";
import { OrganizationResource } from "@clerk/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

export default function OrgPicker() {
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationResource | null>(null);
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  console.log(userMemberships);

  const userData = useCurrentUser();
  console.log(userData);

  const updateCurrentOrg = useMutation(
    api.organizations.updateCurrentOrganization
  );

  if (!isLoaded) {
    return <>Loading</>;
  }

  const handleOrgSelect = (organization: OrganizationResource) => {
    setSelectedOrganization(organization);
    setActive({ organization: organization.id });

    if (userData) {
      updateCurrentOrg({
        clerkId: userData.clerkId,
        organizationId: organization.id,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <Select onValueChange={(value) => {
          const selectedOrg = userMemberships.data?.find(mem => mem.organization.id === value);
          if (selectedOrg) {
            handleOrgSelect(selectedOrg.organization);
          }
        }}>
          <SelectTrigger id="organization-select" className="border rounded p-2 min-w-[100px]">
            <SelectValue placeholder="-- Select an Organization --" />
          </SelectTrigger>
          <SelectContent>
            {userMemberships.data?.map((mem) => (
              <SelectItem key={mem.id} value={mem.organization.id}>
                {mem.organization.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* <OrgView organization={selectedOrganization} /> */}
    </>
  );
}
