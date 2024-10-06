import React from "react";
import ItemList from "@/components/shared/items-list/ItemList";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FriendsPage = (props: Props) => {
  return (
    <>
      <ItemList title="Friends">FriendsPage</ItemList>
      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
