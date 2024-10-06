import { useParams } from "next/navigation"; // Importing useParams to access route parameters
import { useMemo } from "react"; // Importing useMemo for memoizing values

export const useConversation = () => {
  const params = useParams(); // Retrieve route parameters using useParams
  const conversationId = useMemo(
    () => params?.conversationId || ("" as string), // Memoize the conversationId, defaulting to an empty string if undefined
    [params?.conversationId] // Dependency array for useMemo, re-compute if conversationId changes
  );

  const isActive = useMemo(() => !!conversationId, [conversationId]); // Memoize isActive, which is true if conversationId is not empty

  return {
    isActive, // Return whether the conversation is active
    conversationId, // Return the conversationId
  };
};
