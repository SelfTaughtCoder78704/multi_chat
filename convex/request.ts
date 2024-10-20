import { ConvexError, v } from "convex/values"; // Importing ConvexError for error handling and v for value validation
import { mutation } from "./_generated/server"; // Importing mutation to define a server-side mutation
import { getUserByClerkId } from "./_utils"; // Importing a utility function to get user by Clerk ID

export const create = mutation({
  args: {
    email: v.string(), // Expecting an argument 'email' of type string
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Retrieve the current user's identity
    if (!identity) {
      throw new ConvexError("Unauthorized"); // Throw error if user is not authenticated
    }

    if (args.email === identity.email) {
      throw new ConvexError("You cannot send a request to yourself"); // Prevent sending request to oneself
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject }); // Get the current user from the database
    if (!currentUser) {
      throw new ConvexError("User not found"); // Throw error if current user is not found
    }

    // Fetch the current user's organization
    let currentOrganization;
    if (currentUser.currentOrganization) {
      currentOrganization = await ctx.db.query("organizations").withIndex("by_organizationId", (q) => q.eq("organizationId", currentUser.currentOrganization!)).unique();
    }
    console.log("currentOrganization", currentOrganization);
    if (!currentOrganization) {
      throw new ConvexError("Current organization not found"); // Throw error if current organization is not found
    }

    const receiver = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).unique();
    // Query the database to find the user with the provided email

    if (!receiver) {
      throw new ConvexError("Receiver not found"); // Throw error if receiver is not found
    }

    // Check if the receiver is a member of the current organization
    if (!currentOrganization.members?.includes(receiver._id)) {
      throw new ConvexError("Receiver is not a member of your organization"); // Prevent sending request to users not in the same organization
    }

    const requestAlreadySent = await ctx.db.query("requests").withIndex("by_reciever_sender", (q) => q.eq("receiver", receiver._id).eq("sender", currentUser._id)).unique();
    // Check if a request has already been sent from current user to receiver

    if (requestAlreadySent) {
      throw new ConvexError("Request already sent"); // Throw error if request already sent
    }

    const requestAlreadyReceived = await ctx.db.query("requests").withIndex("by_reciever_sender", (q) => q.eq("receiver", currentUser._id).eq("sender", receiver._id)).unique();
    // Check if a request has already been received from receiver to current user

    if (requestAlreadyReceived) {
      throw new ConvexError("Request already received"); // Throw error if request already received
    }

    const request = await ctx.db.insert("requests", {
      sender: currentUser._id, // Set current user as sender
      receiver: receiver._id, // Set found user as receiver
      organizationId: currentOrganization._id, // Set current organization as organizationId
    });

    return request; // Return the newly created request
  },
});



