import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// const Modal = forwardRef(
function Modal({ open, children }) {
  const dialog = useRef();

  // 202. 브라우저 API 싱크를 위한 useEffect
  // 부수 효과(첫 번째 인자)에서 직접적 연관 X => useEffect 사용 (무한 루프 방지가 아닌 특정 값 동기화하기 위함!)
  // 203. Effect Dependencies(의존성): 컴포넌트 함수를 다시 실행하도록 만드는 값 (속성 or 상태)
  // Effect 함수에서 open 속성을 사용하고 있기 때문에, 의존성 배열에 open을 추가해야함! -> 없으면 재실행 X
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  // if (open) {
  //   dialog.current.showModal();
  // } else {
  //   dialog.current.close();
  // }

  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal();
  //     },
  //     close: () => {
  //       dialog.current.close();
  //     },
  //   };
  // });

  return createPortal(
    <dialog className="modal" ref={dialog} /*open={open}*/>
      {open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
