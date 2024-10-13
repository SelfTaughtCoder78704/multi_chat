'use client'

import { useEffect, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';

export default function OrganizationPage() {
  const { organization, isLoaded } = useOrganization(); // Removed organizationId parameter
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && organization) {
      setOrgName(organization.name);
    }
  }, [isLoaded, organization]);

  if (!isLoaded) {
    return <>Loading...</>;
  }

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <h1>Organization: {orgName}</h1>
    </div>
  );
}
