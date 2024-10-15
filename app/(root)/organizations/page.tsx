'use client'

import { useRouter } from 'next/navigation';
import { useOrganizationList } from "@clerk/nextjs";
import ItemList from "@/components/shared/items-list/ItemList";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function OrganizationListPage() {
  const router = useRouter();
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!isLoaded) {
    return <>Loading</>;
  }

  const handleOrgSelect = (selectedOrgId: string) => {
    router.push(`/organizations/${selectedOrgId}`);
  };

  return (
    <>
      <ItemList title="Your Organizations">
        {userMemberships.data?.length === 0 ? (
          <p className="w-full h-full flex items-center justify-center">No Organizations</p>
        ) : (
          userMemberships.data?.map((mem) => (
            <Card 
              key={mem.id} 
              className="w-full p-2 flex flex-row items-center justify-between gap-2 cursor-pointer" 
              onClick={() => handleOrgSelect(mem.organization.id)}
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
      <ConversationFallback />
      <button disabled={!userMemberships.hasNextPage} onClick={() => userMemberships.fetchNext()}>
        Load more
      </button>
    </>
  );
}
