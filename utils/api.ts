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

//   console.log("➡️ API Request:", {
//     url: fullUrl,
//     method: options.method || "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${idToken}`,
//       ...options.headers,
//     },
//     body: options.body,
//   });

//   const response = await fetch(fullUrl, {
//     method: options.method || "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${idToken}`,
//       ...options.headers,
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   });

//   const text = await response.text();

//   console.log("⬅️ API Response:", {
//     url: fullUrl,
//     status: response.status,
//     statusText: response.statusText,
//     rawBody: text,
//   });

//   if (!response.ok) {
//     let errorData;
//     try {
//       errorData = JSON.parse(text);
//     } catch {
//       errorData = {};
//     }
//     throw new Error(
//       errorData.message || `API Error (${response.status}): ${response.statusText}`
//     );
//   }

//   try {
//     return text ? JSON.parse(text) : null;
//   } catch (err) {
//     console.error("❌ Failed to parse JSON:", text);
//     throw new Error("Invalid JSON response");
//   }
// };
