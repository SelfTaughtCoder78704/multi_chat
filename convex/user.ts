import { v } from "convex/values"; // Importing value validation utility
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"; // Importing internal mutation and query functions
import { UserJSON } from "@clerk/nextjs/server";

export const create = internalMutation({
  args: {
    username: v.string(), // Expecting a 'username' argument of type string
    imageUrl: v.string(), // Expecting an 'imageUrl' argument of type string
    clerkId: v.string(), // Expecting a 'clerkId' argument of type string
    email: v.string(), // Expecting an 'email' argument of type string
    currentOrganization: v.optional(v.string()), // Expecting a 'currentOrganization' argument of type string
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('users', args); // Insert a new user into the 'users' collection with the provided arguments
  }
});

export const get = internalQuery({
  args: {
    clerkId: v.string(), // Expecting a 'clerkId' argument of type string
  },
  async handler(ctx, args)  {
    return ctx.db
      .query('users') // Query the 'users' collection in the database
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId)) // Use the 'by_clerkId' index to find a user with the specified clerkId
      .unique(); // Ensure the result is unique (i.e., only one user should match the clerkId)
  }
});

export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() }, // no runtime validation, trust Clerk
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const userRecord = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkUser.id))
      .unique();

    if (userRecord === null) {
      await ctx.db.insert("users", {
        username: `${clerkUser.first_name} ${clerkUser.last_name}`,
        imageUrl: clerkUser.image_url,
        clerkId: clerkUser.id,
        email: clerkUser.email_addresses[0].email_address
      });
    } else {
      await ctx.db.patch(userRecord._id, {
        username: `${clerkUser.first_name} ${clerkUser.last_name}`,
        imageUrl: clerkUser.image_url,
        email: clerkUser.email_addresses[0].email_address
      });
    }
  },
});

export const updateCurrentOrganization = mutation({
  args: {
    clerkId: v.string(),
    organizationId: v.string(),
  },
  async handler(ctx, { clerkId, organizationId }) {
    const userRecord = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (userRecord) {
      await ctx.db.patch(userRecord._id, {
        currentOrganization: organizationId,
      });
    }
  },
});

export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    // Grab all users
    const users = ctx.db.query("users").collect();
    return users;
  },
});


export const currentUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    return ctx.db.query("users").withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId)).unique();
  }
});