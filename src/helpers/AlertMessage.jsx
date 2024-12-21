import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastMessage = (type, messages, options = {}) => {
  toast[type](messages, {
    position: options.position || "bottom-right",
    autoClose: options.autoClose || 3000,
    hideProgressBar: options.hideProgressBar || false,
    closeOnClick: options.closeOnClick || true,
    pauseOnHover: options.pauseOnHover || true,
    draggable: options.draggable || true,
    progress: options.progress || undefined,
    theme: options.theme || "light",
  });
};

export const toastPromise = (
  promise,
  defaultMessages,
  options = {},
  onCloseCallback = null
) => {
  const { pending, success, error } = defaultMessages;

  let isSuccessful = false;

  return toast.promise(
    promise
      .then((res) => {
        isSuccessful = true;
        return res; // Lanjutkan ke toast
      })
      .catch((err) => {
        isSuccessful = false;
        throw err; // Lanjutkan ke toast
      }),
    {
      pending: pending || "Processing...",
      success: {
        render({ data }) {
          return data?.data?.message || success || "Action successful!";
        },
      },
      error: {
        render({ data }) {
          return data?.response?.data?.message || error || "An error occurred!";
        },
      },
    },
    {
      position: options.position || "bottom-right",
      autoClose: options.autoClose || 2500,
      hideProgressBar: options.hideProgressBar ?? false,
      closeOnClick: options.closeOnClick ?? true,
      pauseOnHover: options.pauseOnHover ?? true,
      draggable: options.draggable ?? true,
      theme: options.theme || "light",
      onClose: () => {
        if (onCloseCallback) {
          onCloseCallback(isSuccessful);
        }
      },
    }
  );
};

export function toastDevelop(info) {
  return toastMessage(
    "info",
    `The ${info} feature is currently under development`,
    {
      position: "top-right",
      autoClose: 2500,
    }
  );
}
// import { toast } from "react-hot-toast";

// export const toastMessage = (type, messages, position = "top-center") => {
//   if (type === "success") {
//     toast.success(messages, {
//       position,
//       duration: 2500,
//     });
//   } else if (type === "error") {
//     toast.error(messages, {
//       position,
//       duration: 2500,
//     });
//   } else {
//     toast(messages, {
//       position,
//       duration: 2500,
//     });
//   }
// };
