// 201. 상태 업데이트 최적화
import { useEffect } from "react";

import ProgressBar from "./progressBar";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  // const [remainingTime, setRemainingTime] = useState(TIMER);

  // // 209. useEffect의 Clean-up 함수
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("INTERVAL");
  //     setRemainingTime((prevTime) => prevTime - 10);
  //   }, 10);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  
  useEffect(() => {
    console.log("TIMER SET");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);
    
    // 206. Clean-up Function: 부수 효과 함수의 반환 값
    // Clean-up 함수는 Effect 함수가 최초로 작동되기 바로 전에 작동 X
    // Effect 함수의 최초 실행 다음부터 차후 실행 바로 전에만 작동!
    return () => {
      console.log("Cleaning up timer");
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
