import React from "react";
import { Card } from "@/components/ui/card";
import { useOrganizationList } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { OrganizationResource } from "@clerk/types";
const OrgView = ({
  organization,
}: {
  organization: OrganizationResource | null;
}) => {
  const { isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  // Handle the case where organization is null
  if (!organization) {
    return <p>No organization selected</p>;
  }

  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={organization.imageUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{organization.name}</h4>
        </div>
      </div>
    </Card>
  );
};

export default OrgView;
