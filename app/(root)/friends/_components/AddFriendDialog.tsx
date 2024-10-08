"use client";
import React, {  useState } from "react";
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
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { useQuery } from "convex/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define a type for the user object
type User = {
  clerkId: string;
  email: string;
  username: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AddFriendDialog = (props: Props) => {
  const { mutate: createRequest, pending } = useMutationState(
    api.request.create
  );
  const [selectedUser, setSelectedUser] = useState("");

  // Use the useQuery hook to fetch users
  const users = useQuery(api.user.listAllUsers) || [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    await createRequest({
      email: selectedUser,
    })
      .then(() => {
        setSelectedUser("");
        toast.success("Friend request sent");
      })
      .catch((err) => {
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
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="user-select">Select a user:</label>
            <Select onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full mt-2 p-2 border rounded">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Users</SelectLabel>
                  {users.map((user: User) => (
                    <SelectItem key={user.clerkId} value={user.email}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button disabled={pending} type="submit">Send</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
