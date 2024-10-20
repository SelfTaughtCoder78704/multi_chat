import React from "react";
import SidebarWrapper from "@/components/shared/sidebar/SidebarWrapper";
import { OrganizationSwitcher } from "@clerk/nextjs";
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = React.PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between p-4">
        <Image src="/ncee_logo.svg" alt="logo" width={50} height={50} />
        <OrganizationSwitcher
          hidePersonal={true}
        />
      </div>
      <SidebarWrapper>{children}</SidebarWrapper>
    </div>
  );
};

export default Layout;
