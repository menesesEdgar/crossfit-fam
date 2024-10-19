import React from 'react';
import ReactDOM from 'react-dom';
import { ThreeCircles } from 'react-loader-spinner';

const LoadingModal = ({ loading }) => {
  if (!loading) return null;
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="p-4 grid place-content-center">
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#e3a008"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperclassName=""
        />
      </div>
    </div>,
    document.getElementById('modal-root'),
  );
};

export default LoadingModal;
