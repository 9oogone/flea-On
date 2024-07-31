import React, { useState, useCallback } from 'react';
import PortalPopup from "./PortalPopup";
import styles from '../styles/SellerForm.module.css';

const SellerformSelect = () => {
  const [isDateSelectOpen, setDateSelectOpen] = useState(false);
  const [isTimeSelectOpen, setTimeSelectOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const openDateSelect = useCallback(() => {
    setDateSelectOpen(true);
  }, []);

  const closeDateSelect = useCallback(() => {
    setDateSelectOpen(false);
  }, []);

  const openTimeSelect = useCallback(() => {
    setTimeSelectOpen(true);
  }, []);

  const closeTimeSelect = useCallback(() => {
    setTimeSelectOpen(false);
  }, []);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('thumbnail', thumbnail);

    // 백엔드로 폼 데이터 전송
    try {
      const response = await fetch('/api/upload-thumbnail', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.sellerformSelect}>
      <div className={styles.headerParent}>
        <div className={styles.header}>
          <div className={styles.titleFormParent}>
            <div className={styles.titleForm}>
              <div className={styles.input}>
                <label className={styles.label}></label>
                <input type="text" className={styles.inputField} placeholder="라이브 방송 제목" />
              </div>
            </div>
            <div className={styles.dateAndTimeCompactColl}>
              <div className={styles.date}>
                <div className={styles.year}>7월 21일</div>
              </div>
              <div className={styles.time}>
                <div className={styles.year}>오후 08:00</div>
              </div>
            </div>
          </div>
          <div className={styles.thumbnailContainer}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleThumbnailChange} 
              className={styles.thumbnailInput}
            />
            {thumbnailPreview && (
              <img 
                className={styles.thumbnailPreview} 
                src={thumbnailPreview} 
                alt="Thumbnail Preview" 
              />
            )}
          </div>
          <div className={styles.closeButton}>
            <img className={styles.phxBoldIcon} alt="" src="ph:x-bold.svg" />
          </div>
        </div>
        <div className={styles.sellerTime}>
          <div className={styles.div1}>거래 가능 시간</div>
          <div className={styles.dateParent}>
            <div className={styles.date1}>
              <div className={styles.month} />
              <div className={styles.year}>7월 21일</div>
            </div>
            <div className={styles.time2}>
              <div className={styles.year}>오후 08:30</div>
            </div>
            <div className={styles.div2}>~</div>
            <div className={styles.time2}>
              <div className={styles.year}>오후 10:00</div>
            </div>
            <img className={styles.vectorIcon} alt="" src="Vector.svg" />
          </div>
          <div className={styles.dateGroup}>
            <div className={styles.date2} onClick={openDateSelect}>
              <div className={styles.month} />
              <div className={styles.year}>날짜</div>
              <img className={styles.arrowDropDownIcon} alt="" src="arrow_drop_down.svg" />
            </div>
            <div className={styles.div3}>부터</div>
            <div className={styles.div4}>까지</div>
            <div className={styles.date3} onClick={openTimeSelect}>
              <div className={styles.month} />
              <div className={styles.year3}>시간</div>
              <img className={styles.arrowDropDownIcon} alt="" src="arrow_drop_down.svg" />
            </div>
            <div className={styles.date4} onClick={openTimeSelect}>
              <div className={styles.month} />
              <div className={styles.year3}>시간</div>
              <img className={styles.arrowDropDownIcon} alt="" src="arrow_drop_down.svg" />
            </div>
          </div>
          <div className={styles.parent}>
            <div className={styles.div5}>시간 추가</div>
            <img className={styles.addIcon} alt="" src="add.svg" />
          </div>
        </div>
        <div className={styles.sellerAddress}>
          <div className={styles.div6}>거래 가능 장소</div>
          <div className={styles.dateAndTimeCompactColl1}>
            <div className={styles.date5}>
              <div className={styles.month4}>2024</div>
              <div className={styles.year5}>대전광역시 유성구 동서대로 98-39</div>
            </div>
            <div className={styles.date6}>
              <div className={styles.month4}>2024</div>
              <div className={styles.year}>삼성화재 유성연수원</div>
            </div>
            <div className={styles.time6}>
              <div className={styles.year}>오후 08:00</div>
            </div>
          </div>
          <div className={styles.dateAndTimeCompactColl2}>
            <div className={styles.date6}>
              <div className={styles.month4}>2024</div>
              <div className={styles.year}>경비실 앞</div>
            </div>
            <div className={styles.time6}>
              <div className={styles.year}>오후 08:00</div>
            </div>
          </div>
          <div className={styles.div7}>상세주소</div>
        </div>
        <div className={styles.sellerItem}>
          <div className={styles.sellerItemChild} />
          <div className={styles.wrapper}>
            <div className={styles.div8}>판매목록</div>
          </div>
          <div className={styles.item}>
            <div className={styles.div9}>자전거 따릉이</div>
            <div className={styles.div10}>5만 5000원</div>
          </div>
        </div>
      </div>
      <img className={styles.addIcon1} alt="" src="add.svg" />
      <div className={styles.button}>
        <button type="submit" className={styles.button1}>등록하기</button>
      </div>
      <div className={styles.sellerformSelectChild} />
      <img className={styles.addIcon2} alt="" src="add.svg" />
      {isDateSelectOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeDateSelect}
        >
          {/* <DateSelect onClose={closeDateSelect} /> */}
        </PortalPopup>
      )}
      {isTimeSelectOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeTimeSelect}
        >
          {/* <TimeSelect onClose={closeTimeSelect} /> */}
        </PortalPopup>
      )}
    </form>
  );
};

export default SellerformSelect;
