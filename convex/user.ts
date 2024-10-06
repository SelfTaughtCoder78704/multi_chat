import { v } from "convex/values"; // Importing value validation utility
import { internalMutation, internalQuery } from "./_generated/server"; // Importing internal mutation and query functions
import { UserJSON } from "@clerk/nextjs/server";

export const create = internalMutation({
  args: {
    username: v.string(), // Expecting a 'username' argument of type string
    imageUrl: v.string(), // Expecting an 'imageUrl' argument of type string
    clerkId: v.string(), // Expecting a 'clerkId' argument of type string
    email: v.string(), // Expecting an 'email' argument of type string
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