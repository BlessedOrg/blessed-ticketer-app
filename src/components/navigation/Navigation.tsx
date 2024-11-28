"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useUserContext } from "@/store/UserContext";
import { MobileNav } from "@/components/navigation/MobileNav";
import { AuthModal } from "@/components/navigation/authModal/AuthModal";
import { AvatarMenu } from "@/components/ui/avatar-menu";

export const Navigation = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const onNavToggle = () => {
    setIsMobileNavOpen((prev) => !prev);
  };
  const { isLoggedIn, email } = useUserContext();

  return (
    <nav className="flex justify-between w-full py-6 px-6 sticky top-0 left-0 right-0 z-20 bg-root-background">
      <Link href="/">
        <Image
          src={"/logo.svg"}
          alt="logo blessed"
          height={36}
          width={100}
          className="w-[100px] h-auto"
        />
      </Link>
      <div className="lg:flex gap-4 justify-center rounded-[6.2rem] hidden">

      </div>

      <div className="lg:flex gap-4 items-center hidden justify-end">
        {isLoggedIn && <AvatarMenu />}
        {!isLoggedIn && <AuthModal authType="onboarding" />}
      </div>

      <button
        onClick={onNavToggle}
        className="lg:hidden text-2xl justify-self-end"
      >
        {isMobileNavOpen ? <X /> : <Menu />}
      </button>
      <MobileNav isOpen={isMobileNavOpen} />
    </nav>
  );
};
