"use client";

import React from "react";
import ItemList from "@/components/shared/items-list/ItemList";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import AddFriendDialog from "./_components/AddFriendDialog";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Request from "./_components/Request";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FriendsPage = (props: Props) => {
  const requests = useQuery(api.requests.get);
  console.log(requests);
  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialog />}>
        {
          requests ? requests.length === 0 ? <p className="w-full h-full flex items-center justify-center">No Requests</p> : requests.map(request => {
            return (
              <Request 
              key={request.request._id} 
              id={request.request._id} 
              imageUrl={request.sender.imageUrl} 
              username={request.sender.username} 
              email={request.sender.email}/>
            )
          }) : <Loader2 className="animate-spin" />
        }
      </ItemList>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
