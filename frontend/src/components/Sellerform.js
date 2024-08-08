import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "../styles/SellerForm.module.css";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TimePicker,
  DatePicker,
  DesktopDateTimePicker,
} from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { fetchCategories, createLiveBroadcast } from "../features/live/actions";

dayjs.locale("ko");

const SellerformSelect = ({ onClose }) => {
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [startDate, setStartDate] = useState(dayjs());
  const [transactionTimes, setTransactionTimes] = useState([
    { date: dayjs(), from: dayjs(), to: dayjs() },
  ]);
  const [address, setAddress] = useState("");
  const [bcode, setBcode] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [items, setItems] = useState([
    { name: "", price: "", firstCategoryId: 0, secondCategoryId: 0 },
  ]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTransactionTime = () => {
    setTransactionTimes([
      ...transactionTimes,
      { date: dayjs(), from: dayjs(), to: dayjs() },
    ]);
  };

  const handleRemoveTransactionTime = (index) => {
    if (transactionTimes.length > 1) {
      setTransactionTimes(transactionTimes.filter((_, idx) => idx !== index));
    }
  };

  const handleTransactionTimeChange = (index, field, value) => {
    const updatedTimes = transactionTimes.map((time, idx) =>
      idx === index ? { ...time, [field]: value } : time
    );
    setTransactionTimes(updatedTimes);
    console.log(updatedTimes);
  };

  const handleOpenAddressSearch = () => {
    window.open(
      "/address-search",
      "popup",
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );
  };

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    if (field === "name" && value) {
      dispatch(fetchCategories(value)).then((action) => {
        const payload = action.payload;

        // payload가 존재하고, 필요한 속성이 있는지 확인
        if (payload && payload.firstCategoryId) {
          console.log("카테고리가 잘 나올까요? : ", payload.firstCategoryId);
          newItems[index].firstCategoryId = payload.firstCategoryId;
          newItems[index].secondCategoryId = payload.secondCategoryId;
          setItems(newItems);
        }
      });
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { name: "", price: "", firstCategoryId: 0, secondCategoryId: 0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index));
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data.address) {
        setAddress(event.data.address);
        setBcode(event.data.bcode);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const formatLiveTradeTimes = (updatedTimesArray) => {
    return updatedTimesArray.map((updatedTimes) => {
      const { date, from, to } = updatedTimes;

      const formattedDate = dayjs(date.$d).format("YYYY-MM-DD");
      const tradeStart = dayjs(from.$d).format("HH:mm:ss");
      const tradeEnd = dayjs(to.$d).format("HH:mm:ss");

      return {
        tradeStart,
        tradeEnd,
        date: formattedDate,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);

    try {
      // const response = await fetch('/api/upload-thumbnail', { //썸네일 서버에 올리는거 백에 묻기..
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();
      console.log(bcode);
      const liveData = {
        title: document.getElementById("outlined-basic").value,
        liveDate: dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss"),
        // liveThumbnail: result.filePath, -> 백 완성되면 하기
        liveThumbnail: "https://picsum.photos/160/250",
        tradePlace: `${address} ${detailedAddress}`,
        regionCode: bcode,
        product: items.map((item) => ({
          name: item.name,
          price: parseInt(item.price, 10),
          firstCategoryId: item.firstCategoryId,
          secondCategoryId: item.secondCategoryId,
        })),
        liveTradeTime: formatLiveTradeTimes(transactionTimes),
      };

      dispatch(createLiveBroadcast(liveData));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit} className={styles.sellerformcontainer}>
          <div className={styles.input}>
            <label className={styles.label}></label>
          </div>
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
          >
            <div style={{ flex: 1 }}>
              <TextField
                id="outlined-basic"
                label="라이브 방송 제목"
                size="medium"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: "10px", marginTop: "10px" }}
              />
              <div className="livestarttime" style={{ marginBottom: "10px" }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="ko"
                >
                  <DemoContainer components={["DesktopDateTimePicker"]}>
                    <DesktopDateTimePicker
                      label="라이브 방송 시간"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      ampm={true}
                      disablePast={true}
                      slotProps={{
                        popper: {
                          sx: {
                            "& .MuiDateCalendar-root": {
                              overflow: "hidden",
                              width: "250px",
                              maxHeight: "336px",
                              display: "flex",
                              flexDirection: "column",
                              margin: "0 auto",
                              height: "336px",
                            },
                          },
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className={styles.thumbnailContainer}>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className={styles.thumbnailInput}
                style={{ display: "none" }}
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" style={{ cursor: "pointer" }}>
                {thumbnailPreview ? (
                  <img
                    className={styles.thumbnailPreview}
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                  />
                ) : (
                  <div className={styles.noThumbnail}>
                    <AddToPhotosIcon sx={{ color: "gray" }} />
                  </div>
                )}
              </label>
              {thumbnailPreview && (
                <IconButton
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview(null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </div>
          <div className={styles.regionContainer}>
            <div className={styles.sellerTime}>
              <div className={styles.div1}>거래 장소</div>
              <Button
                variant="outlined"
                onClick={handleOpenAddressSearch}
                fullWidth
                startIcon={<SearchIcon />}
                sx={{
                  color: "black",
                  borderColor: "D9D9D9",
                  borderWidth: "0.5px",
                  backgroundColor: "white",
                  height: "56px",
                }}
              >
                주소 찾기
              </Button>
              {address && (
                <>
                  <TextField
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="주소"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    placeholder="상세 주소"
                    fullWidth
                    margin="normal"
                  />
                </>
              )}
            </div>
          </div>
          <div className={styles.sellerTimeContainer}>
            <div className={styles.sellerTime}>
              <div className={styles.div1}>거래 가능 시간</div>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ko"
              >
                {transactionTimes.map((time, index) => (
                  <div
                    key={index}
                    className={styles.dateParent}
                    style={{ marginBottom: "20px" }}
                  >
                    <div>
                      <DatePicker
                        label="날짜"
                        value={time.date}
                        onChange={(newValue) =>
                          handleTransactionTimeChange(index, "date", newValue)
                        }
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="YYYY년 MM월 DD일"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <DemoItem>
                        <TimePicker
                          label="부터"
                          value={time.from}
                          onChange={(newValue) =>
                            handleTransactionTimeChange(index, "from", newValue)
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </DemoItem>
                      <span style={{ margin: "0 10px" }}>~</span>
                      <DemoItem>
                        <TimePicker
                          label="까지"
                          value={time.to}
                          onChange={(newValue) =>
                            handleTransactionTimeChange(index, "to", newValue)
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </DemoItem>
                      {transactionTimes.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveTransactionTime(index)}
                          style={{ marginLeft: "10px" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </div>
                  </div>
                ))}
              </LocalizationProvider>
            </div>
          </div>
          <div className={styles.button}>
            <Button
              color="primary"
              onClick={handleAddTransactionTime}
              startIcon={
                <AddCircleOutlineIcon
                  style={{ color: "gray", fontSize: "30" }}
                />
              }
              style={{ marginBottom: "10px", display: "flex" }}
            ></Button>
          </div>
          <div className={styles.strokecontainer}>
            <div className={styles.divider}></div>
          </div>
          <div className={styles.strokecontainer}>
            <div className={styles.div1}>판매 목록</div>
          </div>
          <div className={styles.strokecontainer}>
            <div className={styles.itemsList}>
              {items.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <TextField
                    label="상품 이름"
                    value={item.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    className={styles.itemName}
                  />
                  <br />
                  <TextField
                    label="가격"
                    value={item.price}
                    onChange={(e) =>
                      handleInputChange(index, "price", e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    className={styles.itemPrice}
                  />
                  {items.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveItem(index)}
                      style={{ marginLeft: "10px" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.button}>
            <IconButton onClick={handleAddItem} className={styles.addButton}>
              <AddCircleOutlineIcon style={{ color: "gray", fontSize: "30" }} />
            </IconButton>
          </div>
          <div className={styles.button}>
            <button type="submit" className={styles.button1}>
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerformSelect;
