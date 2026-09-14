const Environment = import.meta.env;
const EnvConstants = {
  BACKEND_URL: Environment.VITE_BACKEND_URL,
  FRONTEND_URL: Environment.VITE_FRONTEND_URL,
};

export default EnvConstants;
