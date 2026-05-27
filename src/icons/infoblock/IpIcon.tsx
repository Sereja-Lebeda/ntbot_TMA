interface IpIcon {
  className?: string;
}

function IpIcon({ className }: IpIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <path
        d="M14.625 3.375V9V14.625H9H3.375V8.625V3.375H9H14.625ZM14.25 2.25H3.75C2.925 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V3.75C15.75 2.925 15.075 2.25 14.25 2.25ZM6.75 5.25H5.25V12.75H6.75V5.25ZM11.25 5.25H8.25V12.75H9.75V9.75H11.25C12.075 9.75 12.75 9.075 12.75 8.25V6.75C12.75 5.925 12.075 5.25 11.25 5.25ZM11.25 8.25H9.75V6.75H11.25V8.25Z"
        fill="#908E8E"
      />
    </svg>
  );
}

export default IpIcon;
