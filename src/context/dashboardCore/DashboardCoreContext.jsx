import { createContext } from "react";

const DashboardCoreContext = createContext({
  toastMessage: null,
  toastDevelop: null,
  toastPromise: null,
  token: null,
  isLoadingDashboardCore: false,
  setDashboardCoreLoader: () => {},
  isMe: {},
});

export default DashboardCoreContext;
