import baseAxios from "../utils/httpCommons";

const baseURL = baseAxios();

export async function getToken(param) {
  try {
    const res = await baseURL.post("/recording-java/api/get-token", param);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
}

export function startRecording(param) {
  return baseURL.post("/recording-java/api/recording/start", param);
}

export function stopRecording(param) {
  return baseURL.post("/recording-java/api/recording/stop", param);
}

export function removeUser(param) {
  return baseURL.post("/recording-java/api/remove-user", param);
}
