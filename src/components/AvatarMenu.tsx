"use client"
import { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { CreditCard, LogOut } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

// Function to render a menu item with an icon and label
const renderMenuItem = (
  onClick: () => void,
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  label: string
) => (
  <DropdownMenuItem onClick={onClick} className="cursor-pointer">
    <Icon className="mr-2 h-4 w-4" />
    <span>{label}</span>
  </DropdownMenuItem>
);

export default function AvatarMenu(): ReactElement {
  const { data: session } = useSession();
  const router = useRouter()
  const user = session?.user;

  // Fallback to the first letter of the user's name (capitalized) if image is not available
  const avatarFallback = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Handle sign-out action
  const handleAuthClick = () => {
    signOut(); // Only signing out, no sign-in logic here
  };

  return (
    <div className="empty:hidden text-sm bg-background relative text-secondary-foreground shadow rounded-full flex items-center justify-center size-9">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer size-full">
            <AvatarImage
              src={user?.image || "/default-avatar.png"}
              alt="User Avatar"
            />
            <AvatarFallback className="bg-background text-muted-foreground shadow">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuGroup>
            {user?.role !== "admin" ? renderMenuItem(
              () => router.push("/account/orders"),
              CreditCard,
              "Orders"
            ) : renderMenuItem(
              () => router.push("/admin/dashboard"),
              CreditCard,
              "Dashboard"
            )}
          </DropdownMenuGroup>
          {/* <DropdownMenuSeparator /> */}
          {renderMenuItem(handleAuthClick, LogOut, "Log out")}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
