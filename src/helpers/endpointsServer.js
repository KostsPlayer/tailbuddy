const base = "http://localhost:3000";
// const base = "https://tailbuddy-server.vercel.app";

const endpointsServer = {
  login: `${base}/auth/login`,
  registration: `${base}/auth/registration`,
  chooseRole: `${base}/auth/choose-role`,
  roles: `${base}/api/role`,
  pets: `${base}/api/pets/all`,
  petsID:`${base}/api/pets/`,
  petsCreate: `${base}/api/pets/create`,
  petsUpdate: `${base}/api/pets/update`,
  petsDelete: `${base}/api/pets/delete`,
  businessCategoriesAll: `/api/businessCategory/all`,
  businessCategoriesID: `/api/businessCategory`,
  businessCategoriesCreate: `/api/businessCategory/create`,
  businessCategoriesDelete: `/api/businessCategory/delete`,
  businessCategoriesUpdate: `/api/businessCategory/update`,
  business: `/api/business`,
  businessId: `/api/business-id`,
  userId: `/api/user-id`,
  transactionCreate: `/api/transaction/create`,
  petsUpdate: (id) => `${base}/api/pets/update/${id}`,
  petsDelete: (id) => `${base}/api/pets/delete/${id}`,
  businessCategoriesAll: `${base}/api/businessCategory/all`,
  businessCategoriesID: `${base}/api/businessCategory`,
  businessCategoriesCreate: `${base}/api/businessCategory/create`,
  businessCategoriesDelete: `${base}/api/businessCategory/delete`,
  businessCategoriesUpdate: `${base}/api/businessCategory/update`,
  business: `${base}/api/business`,
  businessId: `${base}/api/business-id`,
};

export default endpointsServer;
