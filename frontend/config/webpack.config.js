module.exports = {
  devServer: {
    historyApiFallback: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      console.log("✅ Webpack DevServer is running...");
      return middlewares;
    },
  },
};
