import { ConvexError, v } from "convex/values"; // Importing ConvexError for error handling and v for value validation
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"; // Importing internalMutation to define a server-side mutation
import { getUserByClerkId } from "./_utils"; // Importing a utility function to get user by Clerk ID
import { Id } from "./_generated/dataModel";



export const getOrganizationById = internalQuery({
  args: {
    organizationId: v.string()
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.query("organizations").withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId)).unique();
    return organization;
  }
})

export const createOrganization = internalMutation({
  args: {
    organizationId: v.string(),
    name: v.string()
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.insert("organizations", {
      organizationId: args.organizationId,
      name: args.name
    });
    return organization;
  }
})


export const updateOrganizationMembers = internalMutation({
  args: {
    organizationId: v.string(),
    members: v.array(v.id('users'))
  },
  handler: async (ctx, args) => {
    const organization = await getOrganizationById(ctx, { organizationId: args.organizationId });
    if (!organization) {
      throw new ConvexError("Organization not found");
    }
    const updatedMembers = [...(organization.members || []), ...args.members as Id<'users'>[]];
    await ctx.db.patch(organization._id, {
      organizationId: args.organizationId,
      members: updatedMembers
    });
    return organization;
  }
})

export const deleteOrganization = internalMutation({
  args: {
    organizationId: v.string()
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.query("organizations")
      .withIndex("by_organizationId", q => q.eq("organizationId", args.organizationId))
      .unique();
    
    if (!organization) {
      throw new ConvexError("Organization not found");
    }

    await ctx.db.delete(organization._id);

    // find the users with the current org id and update the current org to null
    const users = await ctx.db.query("users").withIndex("by_currentOrganization", q => q.eq("currentOrganization", args.organizationId)).collect();
    for (const user of users) {
      await ctx.db.patch(user._id, {
        currentOrganization: undefined
      });
    }
  }
})

export const listOrganizationsOfUser = query({
  args: {
    memberId: v.string()
  },
  handler: async (ctx, args) => {
    const currentUser = await getUserByClerkId({ ctx, clerkId: args.memberId });
    console.log("currentUser", currentUser);
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const organizations = await ctx.db.query("organizations")
      .collect();

      const foundUserOrgs = organizations.map(org => {
        if (org.members?.includes(currentUser._id)) {
          return org;
        } 
      })

    console.log("organizations", organizations);
    return foundUserOrgs;
  }
})


// update current organization for user
export const updateCurrentOrganization = mutation({
  args: {
    clerkId: v.string(),
    organizationId: v.string()
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId({ ctx, clerkId: args.clerkId });
    if (!user) {
      throw new ConvexError("User not found");
    }
    await ctx.db.patch(user._id, {
      currentOrganization: args.organizationId
    })
  }
})