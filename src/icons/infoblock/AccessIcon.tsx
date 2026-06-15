interface AccessIcon {
  className?: string;
}

function AccessIcon({ className }: AccessIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_3570_11078)">
        <path
          d="M2.81445 4.35085C3.21302 4.08514 4.40617 3.55457 5.99874 3.55457C7.59131 3.55457 8.78445 4.08514 9.18217 4.35085M3.96902 6.05399C4.3076 5.88428 5.18617 5.54657 5.99874 5.54657C6.8096 5.54657 7.68902 5.88428 8.0276 6.05399M5.3336 7.78285C5.44502 7.72628 5.73302 7.61571 5.99874 7.61571C6.26445 7.61571 6.55245 7.72714 6.66302 7.78199"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.32328 11.5114C6.16128 11.592 5.91957 11.592 5.677 11.5114C2.52871 10.2968 0.428711 7.22227 0.428711 3.82542V1.31827C0.428711 0.83313 0.832425 0.428558 1.31671 0.428558H10.6836C11.1679 0.428558 11.5716 0.83313 11.5716 1.31827V3.82627C11.5716 7.30456 9.47157 10.2977 6.32328 11.5106"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3570_11078">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default AccessIcon;
