import 'dotenv/config';

export default {
  expo: {
    name: "ApnaSahyogi",
    slug: "apnasahyogi-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "apnasahyogiapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.apnasahyogiapp",
      googleServicesFile: process.env.GOOGLE_SERVICE_KEY_PATH
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      // "@react-native-firebase/app",
      // "@react-native-firebase/auth",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "0808dcfc-d523-4a30-a888-8928c18c9aad",
      },
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
};
