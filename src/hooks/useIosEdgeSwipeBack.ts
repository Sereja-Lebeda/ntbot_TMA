import { useEffect } from "react";
import { useLocation } from "react-router";
import useGoBack from "./useGoBack";

/**
 * useIosEdgeSwipeBack — жест «провести пальцем от левого края вправо» = «назад».
 *
 * ЗАЧЕМ ВООБЩЕ НУЖЕН.
 * В Telegram Mini App на iOS у системного жеста «назад от края» нет события для
 * веб-страницы (проверено логом receiveEvent), поэтому ловим жест сами через
 * touch-события. На Android такой хук НЕ нужен: системная кнопка и жест «назад»
 * уже приходят через Telegram BackButton (см. useTelegramBackButton) — если
 * включить здесь и там, получим двойную навигацию.
 *
 * КАК РАБОТАЕТ (общая идея, годится для любого жеста по краю).
 * Жест = цепочка событий: touchstart → touchmove... → touchend.
 *   1. touchstart: палец коснулся. Если у самого края — начинаем «следить».
 *   2. touchmove: палец движется. Если ушёл больше вверх/вниз, чем вбок — это
 *      скролл, а не наш жест: перестаём следить.
 *   3. touchend: палец убрали. Если прошёл вправо достаточно далеко — выполняем действие.
 *   4. touchcancel: система отобрала касание (touchend не придёт) — сбрасываем слежение.
 *
 * ПОДСКАЗКА ДЛЯ ПОХОЖИХ ЗАДАЧ.
 * Другой жест (свайп вниз с верха, свайп влево)? Меняется только:
 *   - условие старта в handleTouchStart (какая зона экрана),
 *   - формула и знак dx/dy в handleTouchMove/handleTouchEnd,
 *   - действие по успеху.
 * Каркас (флаг isTracking, старт-координаты, 4 события, cleanup) остаётся тем же.
 *
 * Справка: MDN — Touch events, TouchEvent.touches / changedTouches.
 */

// Насколько близко к левому краю (в CSS-пикселях) должно начаться касание.
// Малое значение — чтобы не мешать обычным нажатиям, каруселям и скроллу.
const EDGE_ZONE = 24;

// Сколько пикселей нужно пройти вправо, чтобы жест засчитался.
// Защита от случайных касаний: слишком малое значение срабатывает от лёгкого касания.
const SWIPE_THRESHOLD = 80;

export default function useIosEdgeSwipeBack() {
  // Хуки (useLocation, useGoBack) обязаны вызываться всегда и в одном порядке —
  // поэтому все проверки «а нужен ли жест?» делаем ПОСЛЕ них, внутри эффекта.
  const location = useLocation();
  const goBack = useGoBack(); // уже обёрнут в useCallback → ссылка стабильна и не перезапускает эффект

  // На главной «назад» некуда — жест там не нужен.
  const isRoot = location.pathname === "/";

  useEffect(() => {
    // --- Ранние выходы: жест не нужен → ничего не подписываем ---
    // Возвращаем undefined (cleanup не нужен, т.к. подписки ещё не было).
    if (isRoot) return;
    // Только iOS: на Android «назад» уже приходит через BackButton (иначе дубль).
    if (window.Telegram.WebApp.platform !== "ios") return;

    // --- Состояние жеста ---
    // Обычные let внутри эффекта: они живут в замыкании этого запуска эффекта,
    // все четыре обработчика ниже видят одни и те же значения, а перерисовка
    // компонента не нужна (в отличие от useState). Это НЕ то же, что let в теле
    // компонента — там значения пересоздавались бы на каждом рендере.
    let isTracking = false; // «сейчас идёт потенциальный жест от края»
    let startX = 0; // координаты точки, где палец коснулся экрана
    let startY = 0;

    // Тип TouchEvent — нативный (глобальный), потому что подписываемся через
    // document.addEventListener. React.TouchEvent / React.PointerEvent — только
    // для JSX-пропсов (onTouchStart={...}); у PointerEvent вообще нет touches.
    const handleTouchStart = (e: TouchEvent) => {
      // touches — ВСЕ пальцы на экране сейчас. Больше одного — это мультитач
      // (щипок/зум), системный жест нас не касается: отменяем слежение.
      // Важно: именно .length; e.touches[0] — это объект Touch, не число.
      if (e.touches.length > 1) {
        isTracking = false;
        return;
      }

      const touch = e.touches[0]; // единственный палец
      // clientX — координата X относительно окна (0 = левый край экрана).
      // Начинаем слежение, только если касание началось у самого края.
      if (touch.clientX <= EDGE_ZONE) {
        isTracking = true;
        startX = touch.clientX;
        startY = touch.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTracking) return; // жест не наш — игнорируем

      const touch = e.touches[0]; // где палец сейчас
      const dx = touch.clientX - startX; // сдвиг вбок: вправо > 0, влево < 0
      const dy = touch.clientY - startY; // сдвиг вверх/вниз

      // Если палец идёт больше по вертикали, чем по горизонтали — пользователь
      // скроллит страницу. Перестаём следить, иначе скролл у края мог бы
      // случайно «засчитаться» как свайп назад.
      if (Math.abs(dy) > Math.abs(dx)) {
        isTracking = false;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTracking) {
        // На touchend палец уже убран из e.touches (там пусто), поэтому место,
        // где палец оторвали, берём из changedTouches — списка тех пальцев,
        // что изменились в ЭТОМ событии.
        const touch = e.changedTouches[0];
        const dx = touch.clientX - startX; // конец минус начало

        // Свайп влево даёт отрицательное dx и этого условия не пройдёт —
        // отдельно проверять направление не нужно.
        if (dx > SWIPE_THRESHOLD) {
          goBack();
        }
      }
      // В любом случае палец убран — жест закончен.
      isTracking = false;
    };

    // touchcancel: система перехватила касание (например, свой жест iOS).
    // touchend после этого НЕ придёт, поэтому без этого обработчика isTracking
    // «залип» бы в true до следующего касания.
    const handleTouchCancel = () => {
      isTracking = false;
    };

    // --- Подписка на весь документ ---
    // { passive: true } — обещаем браузеру, что не вызовем preventDefault().
    // Тогда он не ждёт наши обработчики перед прокруткой, и скролл не тормозит.
    // Нам отменять скролл не нужно — только наблюдать.
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    // --- Cleanup ---
    // Выполняется при смене зависимостей и при размонтировании. Без него старые
    // обработчики оставались бы навсегда, и после нескольких перезапусков один
    // свайп вызвал бы goBack() несколько раз.
    // Правило: то же ИМЯ события и та же ССЫЛКА на функцию, что при add.
    // (Опечатка в имени — обработчик молча не снимется.)
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchCancel);
    };
    // Зависимости — всё, что эффект читает снаружи:
    //  - isRoot: сменили страницу → пересчитать, нужен ли жест;
    //  - goBack: стабильная ссылка (useCallback), пересоздаётся только если
    //    изменилась логика «назад».
  }, [isRoot, goBack]);
}
