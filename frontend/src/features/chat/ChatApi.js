import baseAxios from "../../utils/httpCommons";
const baseURL = baseAxios();

export async function sendMessageDB(chatId, param) {
    try {
      console.log(chatId, param)
      const res = await baseURL.post(
        `/fleaon/chat/${chatId}/messages`,
        {},
        {
          params: {
            chatContent: param
          }
        }
      );
      console.log(res);
      return res.data;
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
}
  