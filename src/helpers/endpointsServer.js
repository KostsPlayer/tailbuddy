// const base = "http://localhost:3000";
const base = "https://tailbuddy-server.vercel.app";

const endpointsServer = {
  login: `${base}/auth/login`,
  registration: `${base}/auth/registration`,
  chooseRole: `${base}/auth/choose-role`,
};

export default endpointsServer;
