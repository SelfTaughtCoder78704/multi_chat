import { usePathname } from "next/navigation"; // Importing usePathname to access the current URL path
import { Building, MessageSquare, Users } from "lucide-react"; // Importing icons from lucide-react
import { useMemo } from "react"; // Importing useMemo for memoizing values
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useNavigation = () => {
  const pathname = usePathname(); // Retrieve the current pathname using usePathname
  const requestsCount = useQuery(api.requests.count);
  const paths = useMemo(
    () => [
      {
        name: "Conversations", // Name of the navigation item
        href: "/conversations", // URL path for the navigation item
        icon: <MessageSquare />, // Icon component for the navigation item
        active: pathname.startsWith("/conversations"), // Determine if the current path is active for this item
      },
      {
        name: "Friends", // Name of the navigation item
        href: "/friends", // URL path for the navigation item
        icon: <Users />, // Icon component for the navigation item
        active: pathname.startsWith("/friends"), // Determine if the current path is active for this item
        count: requestsCount,
      },
      {
        name: "Switch Organizations",
        href: "/organizations",
        icon: <Building />,
      },
    ],
    [pathname, requestsCount] // Dependency array for useMemo, re-compute if pathname changes
  );

  return paths; // Return the array of navigation paths
};
