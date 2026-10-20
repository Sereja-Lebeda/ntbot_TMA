interface SendingTicketIconProps {
  className?: string;
}

function SendingTicketIcon({ className }: SendingTicketIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* <!--
    Transition: idle "send" arrow (Type_send) -> "sending" state.
    0.00–0.31s  gentle wind-up: arrow dips 6° and eases back a little
    0.31–1.15s  smooth turn up past 45° (to 49°), shrinking and lifting to the top-right corner
    1.15–1.40s  settles to 45°; the trail and forward nudge already start during this settle
    1.15s+      speed lines stream behind it and the plane keeps nudging forward (loops)
    SMIL starts on load; to replay, re-insert the element or swap the src.
  -->

  <!-- Speed lines: hidden until the turn finishes, then draw in from the plane and retract, in sequence --> */}
      <g
        stroke="currentColor"
        stroke-width="1.1"
        stroke-linecap="round"
        fill="currentColor"
      >
        <path
          d="M11 13L5.5 18.5"
          pathLength="1"
          stroke-dasharray="1 1"
          stroke-dashoffset="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="1;0;-1"
            dur="0.9s"
            begin="turn.end-0.25s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M8 12L5 15"
          pathLength="1"
          stroke-dasharray="1 1"
          stroke-dashoffset="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="1;0;-1"
            dur="0.9s"
            begin="turn.end+0.05s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M12 17L9 20"
          pathLength="1"
          stroke-dasharray="1 1"
          stroke-dashoffset="1"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="1;0;-1"
            dur="0.9s"
            begin="turn.end+0.35s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* <!-- Looping forward nudge along the flight direction, after the turn --> */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;0.7 -0.7;0 0"
          dur="0.9s"
          begin="turn.end-0.25s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
        />
        {/* <!-- Move the plane's centre from its idle spot to the top-right --> */}
        <g transform="translate(13.1 12)">
          <animateTransform
            id="turn"
            attributeName="transform"
            type="translate"
            values="13.1 12;12.6 12.25;16.5 7.5;16.3 7.7"
            keyTimes="0;0.22;0.82;1"
            dur="1.4s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.35 0 0.3 1;0.4 0 0.4 1"
          />
          {/* <!-- Turn 45° upward --> */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;6;-49;-45"
              keyTimes="0;0.22;0.82;1"
              dur="1.4s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.35 0 0.3 1;0.4 0 0.4 1"
            />
            {/* <!-- Shrink to leave room for the trail --> */}
            <g>
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1;0.95;0.69;0.7"
                keyTimes="0;0.22;0.82;1"
                dur="1.4s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.45 0 0.55 1;0.35 0 0.3 1;0.4 0 0.4 1"
              />
              <g transform="translate(-13.1 -12)">
                <path
                  d="M21.7382 10.6875L5.98822 1.69777C5.72255 1.54821 5.41762 1.48316 5.11405 1.51128C4.81048 1.53939 4.52268 1.65934 4.289 1.85514C4.05532 2.05095 3.88685 2.31331 3.80604 2.60727C3.72523 2.90123 3.7359 3.21284 3.83665 3.50058L6.70822 12L3.83665 20.5003C3.75674 20.7265 3.73224 20.9685 3.76521 21.2061C3.79819 21.4438 3.88767 21.67 4.02616 21.8659C4.16465 22.0618 4.3481 22.2216 4.56112 22.3319C4.77414 22.4422 5.01051 22.4999 5.2504 22.5C5.51103 22.4994 5.7671 22.4316 5.99384 22.3031L21.7363 13.2984C21.9685 13.1683 22.162 12.9788 22.2967 12.7493C22.4315 12.5198 22.5028 12.2586 22.5033 11.9924C22.5037 11.7263 22.4334 11.4648 22.2994 11.2348C22.1655 11.0048 21.9728 10.8146 21.741 10.6837L21.7382 10.6875ZM5.2504 21C5.25081 20.9962 5.25081 20.9924 5.2504 20.9887L8.03853 12.75H13.5004C13.6993 12.75 13.8901 12.6709 14.0307 12.5303C14.1714 12.3896 14.2504 12.1989 14.2504 12C14.2504 11.801 14.1714 11.6103 14.0307 11.4696C13.8901 11.329 13.6993 11.25 13.5004 11.25H8.03853L5.25603 3.01496C5.25511 3.00965 5.2532 3.00456 5.2504 2.99996L21.0004 11.984L5.2504 21Z"
                  fill="currentColor"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default SendingTicketIcon;
