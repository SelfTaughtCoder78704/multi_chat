"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

const addFriendForm = z.object({
  email: z
    .string()
    .min(1, { message: "Field cannot be empty" })
    .email({ message: "Enter a valid email address" }),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AddFriendDialog = (props: Props) => {
  const { mutate: createRequest, pending } = useMutationState(api.request.create);

  const form = useForm<z.infer<typeof addFriendForm>>({
    resolver: zodResolver(addFriendForm),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof addFriendForm>) => {
    await createRequest({
      email: values.email,
    }).then(() => {
      form.reset();
      toast.success("Friend request sent");
    }).catch((err) => {
      toast.error(err instanceof ConvexError ? err.data : "Unexpected error");
    });
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <Button size={"icon"} variant={"outline"}>
            <DialogTrigger>
              <UserPlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add a friend</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a friend</DialogTitle>
          <DialogDescription>
            Send a friend request to connect with someone else.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit">Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
