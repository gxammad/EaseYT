module.exports = {
    devServer: {
      setupMiddlewares: (middlewares, devServer) => {
        // Your middleware setup here
        return middlewares;
      }
    }
  };