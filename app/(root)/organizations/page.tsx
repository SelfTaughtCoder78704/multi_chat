'use client'

import { useRouter } from 'next/navigation';
import { useOrganizationList } from "@clerk/nextjs";
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function OrganizationListPage() {
  const { user } = useUser();
  const router = useRouter();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const updateCurrentOrganization = useMutation(api.user.updateCurrentOrganization);

  if (!isLoaded) {
    return <>Loading</>;
  }
  
  const handleOrgSelect = async (selectedOrgId: string) => {
    await setActive({ organization: selectedOrgId });
    if (user) {
      await updateCurrentOrganization({ clerkId: user.id, organizationId: selectedOrgId });
    }
    router.push(`/organizations/${selectedOrgId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <ul>
        {userMemberships.data?.map((mem) => (
          <li key={mem.id}>
            <Button onClick={() => handleOrgSelect(mem.organization.id)}>Select {mem.organization.name}</Button>
          </li>
        ))}
      </ul>
      <button disabled={!userMemberships.hasNextPage} onClick={() => userMemberships.fetchNext()}>
        Load more
      </button>
    </div>
  );
}
