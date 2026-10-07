const tgHaptic = window.Telegram.WebApp.HapticFeedback;

export default function hapticLongPress() {
  tgHaptic.impactOccurred("medium");
}

export function hapticDestructiveThresholdCrossed() {
  tgHaptic.impactOccurred("heavy");
}

export function hapticNavigationThresholdCrossed() {
  tgHaptic.impactOccurred("light");
}

export function hapticTap() {
  tgHaptic.impactOccurred("light");
}

// export function Warning() {
//   tgHaptic.notificationOccurred("warning");
// }
