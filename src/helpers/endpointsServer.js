// const base = "http://localhost:3000";
const base = "https://tailbuddy-server.vercel.app";

const endpointsServer = {
  login: `${base}/auth/login`,
  registration: `${base}/auth/registration`,
  chooseRole: `${base}/auth/choose-role`,
  roles: `${base}/api/role`,
  pets: `${base}/api/pets/all`,
  petsID: `${base}/api/pets/`,
  petsCreate: `${base}/api/pets/create`,
  petsUpdate: `/api/pets/update`,
  petsDelete: `${base}/api/pets/delete`,
  petId: `/api/pets`,
  businessCategoriesAll: `/api/businessCategory/all`,
  businessCategoriesID: `/api/businessCategory`,
  businessCategoriesCreate: `/api/businessCategory/create`,
  businessCategoriesDelete: `/api/businessCategory/delete`,
  businessCategoriesUpdate: `/api/businessCategory/update`,
  business: `/api/business`,
  businessId: `/api/business-id`,
  userId: `/api/user-id`,
  petCategories: `/api/pet-categories`,
  products: `/api/products`,
  productId: `/api/product-id`,
  transactions: `/api/transactions`,
  petSales: `/api/pet-sales`,
  productSales: `/api/product-sales`,
  groomingReservation: `/api/grooming-reservations`,
  photograpy: `/api/photograpy`,
  groomingServices: `/api/grooming-service`,
  photographyServices: `/api/photography-service`,
};

export default endpointsServer;
