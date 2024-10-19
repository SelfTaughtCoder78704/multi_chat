"use client";

import { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import ItemList from "@/components/shared/items-list/ItemList";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import OrgView from "@/components/shared/organization/OrgView";
import { OrganizationResource } from "@clerk/types";

export default function OrganizationListPage() {
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationResource | null>(null);
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!isLoaded) {
    return <>Loading</>;
  }

  const handleOrgSelect = (organization: OrganizationResource) => {
    setSelectedOrganization(organization);
    // router.push(`/organizations/${organization.id}`);
  };

  return (
    <>
      <ItemList title="Your Organizations">
        {userMemberships.data?.length === 0 ? (
          <p className="w-full h-full flex items-center justify-center">
            No Organizations
          </p>
        ) : (
          userMemberships.data?.map((mem) => (
            <Card
              key={mem.id}
              className="w-full p-2 flex flex-row items-center justify-between gap-2 cursor-pointer"
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
      <button
        disabled={!userMemberships.hasNextPage}
        onClick={() => userMemberships.fetchNext()}
      >
        Load more
      </button>
    </>
  );
}
