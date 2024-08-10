// 가격 만원 단위로 1000만원은 안함
export const formatPrice = (price) => {
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
