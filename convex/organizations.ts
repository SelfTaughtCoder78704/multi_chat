import { ConvexError, v } from "convex/values"; // Importing ConvexError for error handling and v for value validation
import { internalMutation, internalQuery, query } from "./_generated/server"; // Importing internalMutation to define a server-side mutation
import { getUserByClerkId } from "./_utils"; // Importing a utility function to get user by Clerk ID
import { Id } from "./_generated/dataModel";






export const createOrUpdateOrganization = internalMutation({
  args: {
    organizationId: v.string(), // Expecting an argument 'organizationId' of type string
    name: v.string(), // Expecting an argument 'name' of type string
    members: v.array(v.id('users')), // Expecting an argument 'members' of type array of user IDs
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId }); // Get the current user from the database
    console.log("Organizations Current User:", currentUser);

    if (!currentUser) {
      throw new ConvexError("User not found"); // Throw error if current user is not found
    }
    console.log("Args:", args);
    // const organization = await ctx.db.query("organizations").withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId)).unique();
    // console.log("Organizations Organization:", organization);

    const organization = await ctx.db.query("organizations").withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId)).unique();
    console.log("Organizations Organization:", organization);
    if (organization === null) {
      await ctx.db.insert("organizations", {
        organizationId: args.organizationId, // Set the organization ID
        name: args.name, // Set the organization name
        members: args.members as Id<'users'>[] // Add the current user as a member
      });
    } else {
      // Append new members to the existing members array
      const updatedMembers = [...(organization.members  || []), ...args.members];
      await ctx.db.patch(organization._id , {
        name: args.name,
        members: updatedMembers
      });
    }

    return organization; // Return the created or updated organization
  }
});


export const listOrganizationsOfUser = query({
  args: {
    memberId: v.string()
  },
  handler: async (ctx, args) => {
    const currentUser = await getUserByClerkId({ ctx, clerkId: args.memberId});
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const organizations = await ctx.db.query("organizations").withIndex("by_members", (q) => q.eq("members", [currentUser._id])).collect();
    return organizations;
  }
})

