const webpack = require("webpack");

module.exports = {
  devServer: {
    historyApiFallback: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false, // In case of self-signed certificates
        logLevel: "debug", // Helps in debugging proxy issues
      },
    },
    allowedHosts: "all", // Allows requests from all hosts
    hot: true, // Enables Hot Module Replacement (HMR)
    open: true, // Automatically opens the browser
    client: {
      overlay: true, // Shows error overlay in the browser
      progress: true, // Displays a progress bar in the console
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("❌ Webpack DevServer is not defined");
      }
      console.log("✅ Webpack DevServer is running on port 3000...");
      return middlewares;
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
  ],
};
