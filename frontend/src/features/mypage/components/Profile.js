import React from "react";
import { useSelector } from "react-redux";
import "../../../styles/Profile.css";

// 임시 사용자 정보
const mockUserInfo = {
  profileImage: "/icons/profile_default.png",
  nickname: "이것저것팝니다",
  email: "hong@example.com",
  phoneNumber: "010-1234-5902",
  address: "대전광역시 유성구 덕명동",
};

const Profile = () => {
  // 리덕스 스토어에서 사용자 정보를 가져옵니다.
  //   const userInfo = useSelector((state) => state.mypage.userInfo);

  const userInfo = mockUserInfo; // 임시 사용자 정보 사용

  // 주소에서 '동' 부분만 추출하기
  const extractDong = (address) => {
    const match = address.match(/(\S+동)/);
    return match ? match[1] : "";
  };

  return (
    <div className="profile">
      <img src={userInfo.profileImage} alt={`${userInfo.nickname}'s profile`} />
      <h3>{userInfo.nickname}</h3>
      <p>{extractDong(userInfo.address)} 주민</p>
      <button>프로필 편집</button>
    </div>
  );
};

export default Profile;
