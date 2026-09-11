import EnvConstant from './envConstants.js';

const serverConstants = {
  URL: `http://localhost:${EnvConstant.PORT}`,
  StartingMessage: `Server is listening to this URI : http://localhost:${EnvConstant.PORT}`,
  ApiWelcomeMessage: 'Welcome to debugging dairies',
};

export default serverConstants;
