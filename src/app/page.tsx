/** @format */

import { redirect } from "next/navigation";

const page = () => {
  // redirect
  redirect("/dashboard");
  return <div>page</div>;
};

export default page;
