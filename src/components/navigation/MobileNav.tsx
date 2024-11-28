import { AuthModal } from "@/components/navigation/authModal/AuthModal";

export const MobileNav = ({ isOpen }) => {
  return (
    <div
      className="lg:hidden fixed w-full h-[100dvh] bg-white z-50 left-0 top-[76.36px]"
      style={{
        transform: `translateX(${isOpen ? "0" : "-100%"})`,
        transition: "transform 0.3s ease"
      }}
    >
      <div className="mt-10 flex flex-col gap-4 items-center justify-center">
        <AuthModal authType="onboarding" />
      </div>
    </div>
  );
};
