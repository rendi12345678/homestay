"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { BiSolidLogOut } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiDashboardFill, } from 'react-icons/ri';
import { FaTasks, FaUsers } from 'react-icons/fa';

const adminLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <RiDashboardFill />,
  },
  {
    href: "/admin/tasks",
    label: "Tasks",
    icon: <FaTasks />,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <FaUsers />,
  },
];

const workerLinks = [
  {
    href: "/worker/my-tasks",
    label: "My Tasks",
    icon: <FaTasks />,
  },
];

const getLinksByRole = (role: string) => {
  switch (role) {
    case 'worker':
      return workerLinks;
    case 'admin':
      return adminLinks;
    default:
      return [];
  }
};

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();
  const [links, setLinks] = useState(workerLinks);

  useEffect(() => {
    if (session?.user) {
      setLinks(getLinksByRole(session?.user?.role));
    }
  }, [session?.user])

  const handleLogout = () => {
    signOut();
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const pathname = usePathname();
  return (
    <aside
      className={`h-screen py-12 shadow bg-background w-full text-white px-6 sticky min-h-svh top-0 transition-all duration-300 bottom-0 ${!isExpanded ? "max-w-32" : "max-w-[300px]"
        }`}
    >
      <div
        className={`mb-12 text-foreground items-center justify-center flex gap-6 ${!isExpanded && "pt-[12px]"
          }`}
      >
        <h1
          className={`mb-0 p-0 transition-all duration-500 delay-200 ${isExpanded && isVisible
            ? "block opacity-100 w-auto"
            : "w-0 opacity-0"
            }`}
          style={{ display: isExpanded ? "block" : "none" }}
        >Servy</h1>
        <span
          className="h-7 text-4xl w-9 cursor-pointer"
          onClick={toggleSidebar}
        >
          <RxHamburgerMenu />
        </span>
      </div>
      <ul className="space-y-4">
        {links.map(({ href, label, icon }, index) => (
          <li key={index} className="group active:scale-95">
            <Link
              href={href}
              className={`flex hover:after:hidden items-center px-8 py-4 rounded-lg space-x-4 w-full transition-all duration-500 ease-in-out ${pathname?.includes(href)
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:bg-primary/85 group-hover:text-primary-foreground/85"
                } ${!isExpanded && "justify-center p-8"}`}
            >
              <span className="text-2xl">{icon}</span>
              <span
                className={`transition-all duration-500 ${isExpanded && isVisible ? "block opacity-100" : "opacity-0"
                  }`}
                style={{ display: isExpanded ? "block" : "none" }}
              >
                {label}
              </span>
            </Link>
          </li>
        ))}
        <li className="group active:scale-95">
          <button
            onClick={handleLogout}
            className={` text-lg font-medium flex hover:after:hidden items-center px-8 py-4 rounded-lg space-x-4 w-full transition-all duration-500 ${pathname?.includes("/auth/logout")
              ? "bg-primary text-primary-foreground"
              : `bg-transparent text-muted-foreground hover:bg-primary/85 group-hover:text-primary-foreground/85 ${!isExpanded && "justify-center p-8"
              }`
              }`}
          >
            <span className="text-2xl">
              <BiSolidLogOut />
            </span>
            <span
              className={`transition-all duration-500 ${isExpanded && isVisible ? "block opacity-100" : "opacity-0"
                }`}
              style={{ display: isExpanded ? "block" : "none" }}
            >
              Logout
            </span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

