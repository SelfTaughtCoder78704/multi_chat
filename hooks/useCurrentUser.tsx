import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";

export const useCurrentUser = () => {
  const { user } = useUser();
  const userData = useQuery(api.user.currentUser, { clerkId: user?.id ?? "" });
  console.log(userData);
  return userData;
};
