import {
  formatDistance,
  parseISO,
  parse,
  format,
  isToday,
  isTomorrow,
} from "date-fns";
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
// 시간 문자열을 포맷팅하는 함수
export const formatTime = (time) => {
  // 입력값이 유효한지 확인
  if (!time) {
    return ""; // 유효하지 않은 입력일 경우 빈 문자열 반환
  }

  try {
    // 문자열을 Date 객체로 변환
    const parsedTime = parse(time, "HH:mm:ss", new Date());

    // 오전/오후 판별
    const isPM = format(parsedTime, "a") === "PM";
    const hours = parsedTime.getHours();
    const minutes = parsedTime.getMinutes();

    // 포맷팅
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const period = isPM ? "오후" : "오전";
    const formattedMinutes = minutes === 0 ? "" : `${minutes}분`;

    return `${period} ${formattedHours}시 ${formattedMinutes}`.trim();
  } catch (error) {
    console.error("Error formatting time:", error);
    return time; // 오류가 발생하면 원래 시간 문자열 반환
  }
};

// 날짜 시간 포맷팅
// 예시 : "2024-10-31T14:30" => "2024년 10월 31일 오후 2시 30분"
export const formatDateTime = (dateString) => {
  try {
    // 날짜 문자열을 Date 객체로 변환
    const date = new Date(dateString);

    // 날짜와 시간의 각 부분을 추출
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 월은 0부터 시작
    const day = date.getDate();
    const hours24 = date.getHours();
    const minutes = date.getMinutes();

    // 오전/오후 및 12시간제 시간 변환
    const period = hours24 >= 12 ? "오후" : "오전";
    const hours12 = hours24 % 12 || 12; // 12시간제 시간, 0시의 경우 12시로 표시

    // 포맷팅
    const formattedDate = `${year}년 ${month}월 ${day}일`;
    const formattedTime = `${period} ${hours12}시 ${minutes}분`;

    return `${formattedDate} ${formattedTime}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatDateTimeDistance = (dateTime) => {
  try {
    // 날짜와 시간을 Date 객체로 변환
    const date = parseISO(dateTime);

    if (isNaN(date)) throw new Error("Invalid date");

    let formattedDate = "";
    let formattedTime = "";

    // 날짜 포맷팅
    if (isToday(date)) {
      formattedDate = "오늘";
    } else if (isTomorrow(date)) {
      formattedDate = "내일";
    } else {
      formattedDate = format(date, "MM/dd");
    }

    // 시간 포맷팅 (AM/PM 00시 00분)
    formattedTime = format(date, "a hh시 mm분");

    return `${formattedDate} ${formattedTime}`;
  } catch (error) {
    console.error("Invalid date format:", dateTime);
    return "Invalid date";
  }
};
