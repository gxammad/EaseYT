const webpack = require("webpack");

module.exports = {
  devServer: {
    // ✅ Suppress specific warnings (like source map parsing)
    ignoreWarnings: [/Failed to parse source map/],

    historyApiFallback: true,
    port: 3000,
    allowedHosts: "all",
    hot: true,
    open: true,

    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
      },
    },

    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },

    /**
     * ✅ Modern alternative to deprecated:
     * onBeforeSetupMiddleware & onAfterSetupMiddleware
     */
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("❌ Webpack DevServer is not defined");
      }

      // Optional: Custom middleware for logging
      devServer.app.use((req, res, next) => {
        console.log(`[${req.method}] ${req.url}`);
        next();
      });

      console.log("✅ DevServer configured on port 3000");
      return middlewares;
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
  ],
};
