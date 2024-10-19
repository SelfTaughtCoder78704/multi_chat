import React from "react";
import { Card } from "@/components/ui/card";
import { OrganizationProfile, useOrganizationList } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { OrganizationResource } from "@clerk/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const OrgView = ({
  organization,
}: {
  organization: OrganizationResource | null;
}) => {
  // get current user
  const userData = useCurrentUser();
  console.log(userData);
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  console.log(userMemberships);
  // find the imageUrl and name of the current organization
  const currentOrganization = userMemberships.data?.find((mem) => mem.organization.id === userData?.currentOrganization);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!currentOrganization && !organization) {
    return <p>No organization selected</p>;
  }

  // Handle the case where organization is null
  if (!organization) {
    return (
      <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
        <div className="flex items-center gap-4 truncate">
          <Avatar>
            <AvatarImage src={currentOrganization?.organization.imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{currentOrganization?.organization.name}</h4>
          </div>
        </div>
        <OrganizationProfile />
      </Card>
    );
  }

  

  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={organization?.imageUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{organization?.name}</h4>
        </div>
      </div>
      <OrganizationProfile />
    </Card>
  );
};

export default OrgView;
