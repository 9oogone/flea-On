import baseAxios from "../../utils/httpCommons";
const baseURL = baseAxios();

export async function sendMessageDB(chatId, contents) {
  try {
    console.log("chatId:", chatId);
    console.log("contents:", contents);

    // 메시지가 [System Message]로 시작하는지 확인
    const isSystemMessage = contents.startsWith("[System Message]");

    const data = {
      chattingId: chatId,
      contents: contents,
      bot: isSystemMessage, // 시스템 메시지이면 bot을 true로 설정
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
    console.log(tradeDate, tradeTimeWithSeconds);
    const res = await baseURL.put(`/fleaon/chatbot/changeTime`, {
      chatId: Number(chatId),
      tradeDate,
      tradeTime: tradeTimeWithSeconds,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error changing trade time:", error);
    throw error;
  }
}
