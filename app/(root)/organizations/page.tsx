"use client";

import { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import ItemList from "@/components/shared/items-list/ItemList";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import OrgView from "@/components/shared/organization/OrgView";
import { OrganizationResource } from "@clerk/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function OrganizationListPage() {
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
      <ItemList title="Your Organizations">
        {userMemberships.data?.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <p>No organizations found</p>
          </div>
        ) : (
          userMemberships.data?.map((mem) => (
            <Card
              key={mem.id}
              className={`w-full p-2 flex flex-row items-center justify-between gap-2 cursor-pointer transition-colors duration-200 ${
                selectedOrganization?.id === mem.organization.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
              onClick={() => handleOrgSelect(mem.organization)}
            >
              <div className="flex items-center gap-4 truncate">
                <Avatar>
                  <AvatarImage src={mem.organization.imageUrl} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <h4 className="truncate">{mem.organization.name}</h4>
                </div>
              </div>
            </Card>
          ))
        )}
      </ItemList>
      <OrgView organization={selectedOrganization} />
    </>
  );
}
