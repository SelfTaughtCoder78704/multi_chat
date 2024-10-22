import { httpRouter } from "convex/server"; // Importing httpRouter to define HTTP routes
import { httpAction } from "./_generated/server"; // Importing httpAction to define HTTP actions
import { Webhook } from "svix"; // Importing Webhook from svix for webhook verification
import { internal } from "./_generated/api"; // Importing internal API for database operations
import { WebhookEvent } from "@clerk/nextjs/server"; // Importing WebhookEvent type from Clerk
import { Id } from "./_generated/dataModel";

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text(); // Extract the payload from the request body
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!, // Get 'svix-id' header
    'svix-timestamp': req.headers.get('svix-timestamp')!, // Get 'svix-timestamp' header
    'svix-signature': req.headers.get('svix-signature')!, // Get 'svix-signature' header
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || ''); // Initialize Webhook with secret

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent; // Verify the payload and headers
    return event; // Return the verified event
  } catch (error) {
    console.error(error); // Log any verification errors
    return; // Return undefined if verification fails
  }
};

const handleClerkWebhook = httpAction(
  async (ctx, req) => {
    const event = await validatePayload(req); // Validate the incoming request payload

    if (!event) {
      return new Response('Invalid payload', { status: 400 }); // Respond with 400 if payload is invalid
    }

    switch (event.type) {
      case 'user.created':
      case 'user.updated':
        console.log('Creating/updating user', event.data.id);
        await ctx.runMutation(internal.user.updateOrCreateUser, {
          clerkUser: event.data
        });
        break;

      case 'organization.created':
        console.log('Creating organization', event.data.id);
        await ctx.runMutation(internal.organizations.createOrganization, {
          organizationId: event.data.id,
          name: event.data.name
        });
        break;
      
      case 'organization.deleted':
        await ctx.runMutation(internal.organizations.deleteOrganization, {
          organizationId: event.data.id as string
        });
        break;

      case 'organizationMembership.created':
      case 'organizationMembership.updated':
        const userId = await ctx.runQuery(internal.user.get, {
          clerkId: event.data.public_user_data.user_id
        });
        
        await ctx.runMutation(internal.organizations.updateOrganizationMembers, {
          organizationId: event.data.organization.id,
          members: [userId?._id as Id<'users'>]
        });

        await ctx.runMutation(internal.user.internalUpdateCurrentOrganization, {
          userId: userId?._id as Id<'users'>,
          organizationId: event.data.organization.id
        });
        break;

      case 'organizationMembership.deleted':
        const deletedUserId = await ctx.runQuery(internal.user.get, {
          clerkId: event.data.public_user_data.user_id
        });

        // Fetch the organization to remove the user from its members
        const organization = await ctx.runQuery(internal.organizations.getOrganizationById, {
          organizationId: event.data.organization.id
        });

        if (organization) {
          const updatedMembers = organization.members?.filter(memberId => memberId !== deletedUserId?._id) || [];
          await ctx.runMutation(internal.organizations.updateOrganizationMembers, {
            organizationId: event.data.organization.id,
            members: updatedMembers
          });
        }
        break;

      default:
        console.log('Clerk webhook event not supported', event.type);
    }
    return new Response(null, { status: 200 }); // Respond with 200 OK
  }
);

const http = httpRouter(); // Initialize HTTP router

http.route({
  path: '/clerk-users-webhook', // Define the path for the webhook
  method: 'POST', // Define the HTTP method
  handler: handleClerkWebhook // Assign the handler function
});

export default http; // Export the HTTP router
