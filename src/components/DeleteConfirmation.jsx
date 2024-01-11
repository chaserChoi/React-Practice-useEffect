import { useEffect } from "react";

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    console.log("TIMER SET");
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);
    
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
    </div>
  );
}
