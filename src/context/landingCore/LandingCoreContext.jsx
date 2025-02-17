import { createContext } from "react";

const LandingCoreContext = createContext({
  toastMessage: null,
  toastDevelop: null,
  toastPromise: null,
  token: null,
  isLoadingDashboardCore: false,
  setDashboardCoreLoader: () => {},
  business: [],
  businessCategories: [],
  pets: [],
  products: [],
  groomingServices: [],
  photographyServices: [],
  isMe: {},
});

export default LandingCoreContext;
