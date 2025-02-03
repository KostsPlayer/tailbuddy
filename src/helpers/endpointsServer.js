const base = "http://localhost:3000";
// const base = "https://tailbuddy-server.vercel.app";

const endpointsServer = {
  login: `${base}/auth/login`,
  registration: `${base}/auth/registration`,
  chooseRole: `${base}/auth/choose-role`,
  roles: `${base}/api/role`,
  business: `${base}/api/business`,
  pets: `${base}/api/pets/all`,
  businessCategoriesAll: "/api/businessCategory/all",
  businessCategoriesID: "/api/businessCategory",
  businessCategoriesCreate: "/api/businessCategory/create",
  businessCategoriesDelete: "/api/businessCategory/delete",
  businessCategoriesUpdate: "/api/businessCategory/update",
  business: "/api/business",
  businessId: "/api/business-id",
};

export default endpointsServer;
