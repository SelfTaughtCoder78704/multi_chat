import { QueryCtx, MutationCtx } from "./_generated/server"; // Importing types for query and mutation contexts

export const getUserByClerkId = async ({
  ctx, clerkId
}: {
  ctx: QueryCtx | MutationCtx, clerkId: string // Function parameters: context (either query or mutation) and clerkId (string)
}) => {
    return await ctx.db.query("users") // Query the "users" collection in the database
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId)) // Use the "by_clerkId" index to find a user with the specified clerkId
      .unique(); // Ensure the result is unique (i.e., only one user should match the clerkId)
}

