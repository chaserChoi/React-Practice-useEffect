import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

// 이 코드는 동시에 작동하고 App 컴포넌트 함수 실행이 끝나기를 기다릴 필요 X -> 시간 소요 X
  const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  const storedPlaces = storedIds.map((id) =>
    AVAILABLE_PLACES.find((place) => place.id === id)
  );

function App() {

  // const modal = useRef();
  const [modalIsOpen, setModalOpen] = useState(false);
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]); // [
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // 200. useEffect 필요없는 경우
  // localStorage를 사용하고 있는 반면, 사용자의 위치를 찾는 데 사용한 navigator 코드는 동시에 작동하기 때문
  // useEffect(() => {
  //   const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
  //   const storedPlaces = storedIds.map(id =>
  //     AVAILABLE_PLACES.find((place) => place.id === id)
  //   );

  //   setPickedPlaces(storedPlaces);
  // }, []);

  // 198. useEffect Hook
  // useEffect(1.() => {}, 2.[]) : 1. 부수 효과를 묶어줄 함수, 2. 의존성 배열
  // 앱 컴포넌트 함수 실행 완료 후, 부수 효과 함수 실행 -> 의존성 X -> 재실행 X
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.altitude,
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  // 196~197 : Side Effect(부수 효과)
  // 현재 컴포넌트 렌더링 과정에 직접적으로 관여하지 않는 작업
  // But, 상태 업데이트 함수 호출 -> 상태가 포함된 컴포넌트 함수 재실행 -> 무한 루프 발생
  // -> useEffect Hook 사용!
  // navigator.geolocation.getCurrentPosition((position) => {
  //   const sortedPlaces = sortPlacesByDistance(
  //     AVAILABLE_PLACES,
  //     position.coords.altitude,
  //     position.coords.longitude
  //   );

  //   setAvailablePlaces(sortedPlaces)
  // });

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    // modal.current.close();
    setModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // 199. 부수 효과의 또 다른 예시
    // 위의 navigator 코드와 달리 useEffect Hook을 사용 X
    // 훅의 특성 때문에 함수 내 훅 사용 X
    // handleSelectPlace 함수는 컴포넌트 함수가 재실행되어도 재실행 X
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  // 208. useCallback Hook
  // 함수를 반환하는 함수를 반환하는 함수
  // useCallback(() => {}, []) : 1. 함수를 반환하는 함수, 2. 의존성 배열
  // 의존성 배열에 있는 값이 변경되지 않으면, 함수를 반환하는 함수는 이전에 반환한 함수를 반환
  // 의존성 배열에 있는 값이 변경되면, 함수를 반환하는 함수는 새로운 함수를 반환
  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    // modal.current.close();
    setModalOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  // function handleRemovePlace() {
  //   setPickedPlaces((prevPickedPlaces) =>
  //     prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
  //   );
  //   // modal.current.close();
  //   // setModalOpen(false);

  //   const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  //   localStorage.setItem(
  //     'selectedPlaces', 
  //     JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
  //   );
  // }

  return (
    <>
      <Modal /* ref={modal} */ open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance ..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
