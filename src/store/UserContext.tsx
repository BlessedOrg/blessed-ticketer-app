"use client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { apiUrl } from "@/variables/varaibles";
import { fetcherWithToken } from "@/requests/requests";
import { deleteCookie } from "cookies-next";
import { FixedLoading } from "@/components/ui/fixed-loading";
import AuthModalContent from "@/components/navigation/authModal/AuthModal";

interface IProps {
  children: ReactNode;
}
interface UserHook {
  walletAddress: string | null;
  smartWalletAddress: string | null;
  email: string | null;
  isLoading: boolean;
  id: string | null;
  mutate: () => Promise<any>;
  isLoggedIn: boolean;
  onLogout: () => Promise<void>;
  userEventsPermissions: any;
}
const defaultState = {
  walletAddress: null,
  smartWalletAddress: null,
  isLoading: false,
  email: null,
  id: null,
  isLoggedIn: false,
  mutate: async () => {}
} as UserHook;

const UserContext = createContext<UserHook | undefined>(undefined);

const UserContextProvider = ({ children }: IProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(defaultState);
  const [userEventsPermissions, setUserEventsPermissions] = useState(null);

  const { data, mutate, isLoading } = useSWR(
    `${apiUrl}/private/users/me`,
    fetcherWithToken
  );

  const { data: userEventsPermissionsData, mutate: mutatePermissions, isLoading: isPermissionsLoading } = useSWR(
    `${apiUrl}/private/users/events-permissions`,
    fetcherWithToken
  );

  useEffect(() => {
    if (userEventsPermissionsData) {
      setUserEventsPermissions(userEventsPermissionsData);
    }
  }, [userEventsPermissionsData]);

  useEffect(() => {
    if (!data?.error && data?.id) {
      setUserData(data);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [data]);

  const onLogout = async () => {
    const res = await fetcherWithToken(`${apiUrl}/private/users/logout`, {
      method: "POST"
    });
    if (!!res?.message) {
      setUserData(defaultState);
      setIsLoggedIn(false);
      deleteCookie("bouncerToken");

      window.location.reload();
    }
  };

  const unloggedState = {
    ...defaultState,
    isLoading,
    isLoggedIn,
    onLogout
  };

  return (
    <UserContext.Provider
      value={!isLoggedIn ? unloggedState : {
        ...userData,
        mutate,
        isLoading,
        isLoggedIn,
        onLogout,
        userEventsPermissions
      }}
    >
      {isLoading && !isLoggedIn && <FixedLoading />}
      {!isLoading && isLoggedIn && children}
      {!isLoggedIn && <AuthModalContent authType="onboarding" isOpen={true} />}
    </UserContext.Provider>
  );
};
const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used inside UserContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
