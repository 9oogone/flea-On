import React from 'react';
import styles from './Chating.module.css';

const Chating = () => {
  	return (
    		<div className={styles.chating}>
      			<div className={styles.chatingChild} />
      			<div className={styles.chatingInner}>
        				<div className={styles.rectangleParent}>
          					<div className={styles.groupChild} />
          					<div className={styles.div}>거래 파기</div>
        				</div>
      			</div>
      			<div className={styles.parent}>
        				<div className={styles.div1}>거래를 파기하시겠습니까?</div>
          					<div className={styles.div2}>파기된 거래는 재개할 수 없습니다.</div>
          					</div>
          					<img className={styles.chatingItem} alt="" src="Group 145.svg" />
          					<img className={styles.bxxIcon} alt="" src="bx:x.svg" />
          					</div>);
        				};
        				
        				export default Chating;
