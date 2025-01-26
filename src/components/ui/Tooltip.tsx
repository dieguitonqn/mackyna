import { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

const Tooltip = ({ children, text }: TooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      
      {show && (
        <div className="absolute z-10 px-2 py-1 text-xs text-white bg-gray-800 rounded-md -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {text}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800" />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 