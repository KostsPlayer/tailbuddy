// const base = "http://localhost:3000";
const base = "https://tailbuddy-server.vercel.app";

const endpointsServer = {
  login: `${base}/auth/login`,
  registration: `${base}/auth/registration`,
  chooseRole: `${base}/auth/choose-role`,
  roles: `${base}/api/role`,
  business: `${base}/api/business`, 
  pets: `${base}/api/pets/all`,
};

export default endpointsServer;
