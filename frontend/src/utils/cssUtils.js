import { formatDistance, parseISO, parse, format } from "date-fns";
import { ko } from "date-fns/locale";

// 가격 만원 단위로 1000만원은 안함
export const formatPrice = (price) => {
  if (price === 0) {
    return "♥무료나눔♥";
  }
  if (price < 10000) {
    return `${price}원`;
  }

  const manWon = Math.floor(price / 10000);
  const rest = price % 10000;

  if (rest === 0) {
    return `${manWon}만원`;
  } else {
    return `${manWon}만 ${rest}원`;
  }
};

// 주소에서 '동' 부분만 추출하기
export const extractDong = (address) => {
  const match = address.match(/(\S+동)/);
  return match ? match[1] : "";
};

//날짜 : 0일전 0시간 전
export const getRelativeDate = (date) => {
  const itemDate = parseISO(date);
  const now = new Date();
  const distance = formatDistance(itemDate, now, {
    addSuffix: true,
    locale: ko,
  });
  return distance;
};

// 시간 : 오전 0시 0분
export const formatTime = (time) => {
  const parsedTime = parse(time, "HH:mm:ss", new Date());
  const isPM = format(parsedTime, "a") === "PM";
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const period = isPM ? "오후" : "오전";

  const formattedMinutes = minutes === 0 ? "" : `${minutes}분`;

  return `${period} ${formattedHours}시 ${formattedMinutes}`.trim();
};
