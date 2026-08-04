// styles/shadowLift.ts

// для элементов БЕЗ disabled-состояния (div-карточки, плитки категорий)
export const shadowLiftCategoryStyle = `xl:transition-all xl:duration-600 xl:ease-in-out xl:hover:-translate-x-1 xl:hover:-translate-y-1 xl:hover:z-10 xl:hover:shadow-[4px_4px_0_0_var(--text-primary)]`;

export const shadowLiftCardStyle = `xl:transition-all xl:duration-600 xl:ease-in-out xl:hover:-translate-x-1 xl:hover:-translate-y-1 xl:hover:z-10 xl:hover:shadow-[4px_4px_0_0_var(--text-tertiary)]`;

// для button-элементов С disabled-состоянием
export const shadowLiftButtonStyle = `xl:transition-all xl:duration-600 xl:ease-in-out
xl:enabled:hover:-translate-x-1
xl:enabled:hover:-translate-y-1
xl:enabled:hover:z-10
xl:enabled:hover:shadow-[4px_4px_0_0_var(--text-primary)]
xl:enabled:cursor-pointer
xl:disabled:bg-(--bg-disable-btn)`;
