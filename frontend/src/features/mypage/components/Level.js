// src/components/UserLevel.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSalesCount } from "../levelSlice"; // 수정된 부분

const UserLevel = () => {
  const dispatch = useDispatch();
  const salesCount = useSelector((state) => state.level.salesCount);
  const level = useSelector((state) => state.level.level);
  const nextLevel = useSelector((state) => state.level.nextLevel);
  const levelIcon = useSelector((state) => state.level.levelIcon);
  const nextLevelIcon = useSelector((state) => state.level.nextLevelIcon);
  const salesGoal = useSelector((state) => state.level.salesGoal);
  const currentLevelSales = useSelector(
    (state) => state.level.currentLevelSales
  );
  const remainingSales = salesGoal - currentLevelSales;

  // 예를 들어, 판매 갯수를 1씩 업데이트
  const handleUpdateSalesCount = () => {
    dispatch(updateSalesCount(salesCount + 1));
  };

  return (
    <div>
      <img src={levelIcon} alt={`${level} 아이콘`} />
      <p>{level}</p>
      {level === "큰손" ? (
        <p>
          {`지금까지 ${salesCount}개를 판매했어요!`} <br />
          {`${salesCount}/${salesGoal}`}
        </p>
      ) : (
        <p>
          {`${remainingSales}개만 더 구매하면 ${nextLevel}!`}
          {currentLevelSales}/{salesGoal}
          <img src={nextLevelIcon} alt={`${nextLevel} 아이콘`} />
        </p>
      )}
      <button type="button" onClick={handleUpdateSalesCount}>
        판매 갯수 업데이트
      </button>
    </div>
  );
};

export default UserLevel;
