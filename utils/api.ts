// // lib/api.ts
// import auth from "@react-native-firebase/auth";
// import Constants from "expo-constants";

// const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

// interface ApiOptions {
//   method?: "GET" | "POST" | "PUT" | "DELETE";
//   headers?: Record<string, string>;
//   body?: any;
// }

// export const callApi = async (
//   endpoint: string,
//   options: ApiOptions = {}
// ): Promise<any> => {
//   const currentUser = auth().currentUser;

//   if (!currentUser) {
//     throw new Error("User not authenticated");
//   }

//   const idToken = await currentUser.getIdToken();
//   const fullUrl = `${API_BASE_URL}${endpoint}`;

//   const requestOptions = {
//     method: options.method || "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${idToken}`,
//       ...options.headers,
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   };

//   console.log("➡️ API Request:", {
//     url: fullUrl,
//     ...requestOptions,
//   });

//   const response = await fetch(fullUrl, requestOptions);

//   let result;
//   try {
//     result = await response.json();
//   } catch (e) {
//     console.error("❌ Failed to parse JSON");
//     throw new Error("Invalid JSON response");
//   }

//   console.log("⬅️ API Response:", {
//     url: fullUrl,
//     status: response.status,
//     statusText: response.statusText,
//     body: result,
//   });

//   if (!response.ok) {
//     throw new Error(result?.message || `API Error (${response.status})`);
//   }

//   return result;
// };
