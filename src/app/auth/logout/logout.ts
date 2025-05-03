/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */

import Cookies from "js-cookie"; /** @format */

type LogoutResponse = {
  status: string;
};

type Props = {
  setLogout: () => Promise<LogoutResponse>;
  setLoadLogout: React.Dispatch<React.SetStateAction<boolean>>;
  router: any;
};
const handleLogout = async ({ setLogout, setLoadLogout, router }: Props) => {
  setLoadLogout(true);
  const res = await setLogout();
  if (res?.status === "success") {
    // delete cookie
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    return router.push("/auth/login");
    console.log({ router });
  }
};

export default handleLogout;
