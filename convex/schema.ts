import { defineSchema, defineTable } from "convex/server"; // Importing functions to define schema and tables
import { v } from "convex/values"; // Importing value validation utility

export default defineSchema({
  users: defineTable({
    username: v.string(), // Define 'username' field as a string
    imageUrl: v.string(), // Define 'imageUrl' field as a string
    clerkId: v.string(), // Define 'clerkId' field as a string
    email: v.string(), // Define 'email' field as a string
  })
  .index('by_email', ['email']) // Create an index on the 'email' field for efficient querying
  .index('by_clerkId', ['clerkId']), // Create an index on the 'clerkId' field for efficient querying

  requests: defineTable({
    sender: v.string(), // Define 'sender' field as a string
    receiver: v.string(), // Define 'receiver' field as a string
  })
  .index('by_receiver', ['receiver']) // Create an index on the 'receiver' field for efficient querying
  .index('by_reciever_sender', ['receiver', 'sender']), // Create a composite index on 'receiver' and 'sender' for efficient querying

  organizations: defineTable({
    organizationId: v.string(), // Define 'organizationId' field as a string
    name: v.string(), // Define 'name' field as a string
    members: v.optional(v.array(v.id('users'))), // Define 'members' field as an optional array of user IDs
  })
  .index('by_organizationId', ['organizationId']) // Create an index on the 'organizationId' field for efficient querying
  .index('by_members', ['members']) // Create an index on the 'members' field for efficient querying
});