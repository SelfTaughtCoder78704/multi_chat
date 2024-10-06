import React from "react";
import { Card } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = React.PropsWithChildren<{}>;

const ConversationContainer = ({ children }: Props) => {
  return (
    <Card className="h-[calc(100svh-32px)] w-full lg:h-full p-2 flex flex-col gap-2">
      {children}
    </Card>
  );
};

export default ConversationContainer;
