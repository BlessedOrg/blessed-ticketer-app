"use server";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export const serverFetcherWithToken = async (url: string, options?: RequestInit | undefined) => {
  let accessToken = getCookie("bouncerToken");
  if (!accessToken) {
    accessToken = cookies().get("bouncerToken").value;
  }

  const { headers, ...rest } = options || {};
  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      Authorization: `Bearer ${accessToken}`
    }
  }).then((res: Response) => res.json());
  if (res?.error || res?.statusCode >= 400) {
    throw new Error(res.message, { cause: res.error });
  }
  return res;
};