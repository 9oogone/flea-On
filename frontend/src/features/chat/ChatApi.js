import baseAxios from "../../utils/httpCommons";
const baseURL = baseAxios();

export async function sendMessageDB(chatId, contents) {
  try {
    console.log("chatId:", chatId);
    console.log("contents:", contents);

    const data = {
      chattingId: chatId,
      contents: contents,
      bot: false,
    };
    console.log("Request data:", JSON.stringify(data));

    const res = await baseURL.post(`/fleaon/chat/messages`, data);
    console.log("Response:", res);
    return res.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getTradeDetail(chatId) {
  try {
    const res = await baseURL.get(
      `https://i11b202.p.ssafy.io/fleaon/chatbot/${chatId}/detail`
    );
    console.log("거래일자 여기서 봄 : ", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching detail data:", error);
    throw error;
  }
}

export async function changeTradeTime(chatId, tradeDate, tradeTime) {
  try {
    // 초 추가
    const tradeTimeWithSeconds = `${tradeTime}:00`;

    const res = await baseURL.put(
      `/fleaon/chatbot/changeTime/`,
      {
        chatId,
        tradeDate,
        tradeTime: tradeTimeWithSeconds
      }
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error changing trade time:", error);
    throw error;
  }
}
