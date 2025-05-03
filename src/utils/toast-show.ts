/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */

import toast from "react-hot-toast";

type Props = {
  event: any;
  position?: "top-right";
};

const toastShow = ({ event, position }: Props) => {
  switch (event.status) {
    case "success":
      toast.success(event.message, { duration: 4000, position });
      break;
    case "error":
      toast.error(event.message, { duration: 4000, position });
      break;
    default:
      break;
  }
};

export default toastShow;
