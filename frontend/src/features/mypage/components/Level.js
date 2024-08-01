// src/components/UserLevel.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSalesCount } from "../levelSlice"; // 수정된 부분

const UserLevel = () => {
  const dispatch = useDispatch();
  const salesCount = useSelector((state) => state.level.salesCount); // 수정된 부분
  const level = useSelector((state) => state.level.level); // 수정된 부분

  // 예를 들어, 판매 갯수를 5로 업데이트
  const handleUpdateSalesCount = () => {
    dispatch(updateSalesCount(21));
  };

  return (
    <div>
      <h1>현재 판매 갯수: {salesCount}</h1>
      <h2>현재 레벨: {level}</h2>
      <button onClick={handleUpdateSalesCount}>판매 갯수 업데이트</button>
    </div>
  );
};

export default UserLevel;
