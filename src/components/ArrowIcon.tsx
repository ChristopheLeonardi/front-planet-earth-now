import React from "react";

interface ArrowIconProps {
  className?: string;
  color?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ className = "", color = "var(--green-pen)" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 134.18 76.59"
      className={className}
    >
      <path
        fill={color}
        d="M124.68,76.59c-2.43,0-4.86-.93-6.72-2.78l-50.88-50.87-50.88,50.87c-3.71,3.71-9.72,3.71-13.43,0s-3.71-9.72,0-13.43L60.37,2.78c3.71-3.71,9.72-3.71,13.43,0l57.59,57.59c3.71,3.71,3.71,9.72,0,13.43-1.85,1.85-4.29,2.78-6.72,2.78Z"
      />
    </svg>
  );
};

export default ArrowIcon;