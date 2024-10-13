"use client";
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react'



const OrganizationsPage = () => {
  const {user} = useUser();
  console.log(user?.id);
  const organizations = useQuery(api.organizations.listOrganizationsOfUser, {
    memberId: user?.id as Id<"users">
  });
  return (
    <div>
      <h1>Organizations</h1>
      <p>Manage your organizations here</p>
      {organizations?.map((organization) => (
        <div key={organization?._id}>{organization?.name}</div>
      ))}
      <h3>Personal Accounts Can&apos;t be used on this site. Please pick an organization from the menu to continue.</h3>
    </div>
  )
}

export default OrganizationsPage