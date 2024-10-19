import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { Id } from "./_generated/dataModel"; // Adjust the import path as necessary

export const get = query({
  args: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const currentUser = await getUserByClerkId({ctx, clerkId: identity.subject});
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    let currentOrganization;
    if (currentUser.currentOrganization) {
      currentOrganization = await ctx.db.query("organizations").withIndex("by_organizationId", (q) => q.eq("organizationId", currentUser.currentOrganization!)).unique();
    }

    if (!currentOrganization) {
      throw new ConvexError("Current organization not found");
    }

    

    const requests = await ctx.db.query("requests").withIndex("by_receiver", (q) => q.eq("receiver", currentUser._id)).collect();
    const requestsWithSender = await Promise.all(requests.map(async (request) => {
      const senderId: Id<"users"> = request.sender as Id<"users">; // Cast or ensure the type
      const sender = await ctx.db.get(senderId);
      
      if (!sender) {
        throw new ConvexError("Sender not found");
      }
      return {
        sender, 
        request
      }
    }));
    return requestsWithSender;
  }
});


export const count = query({
  args: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const requests = await ctx.db
      .query("requests")
      .withIndex("by_receiver", (q) => q.eq("receiver", currentUser._id))
      .collect();

    return requests.length;
  },
});