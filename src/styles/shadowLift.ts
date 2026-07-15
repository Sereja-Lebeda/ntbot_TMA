// styles/shadowLift.ts

// для элементов БЕЗ disabled-состояния (div-карточки, плитки категорий)
export const shadowLiftCategoryStyle = `transition-all duration-600 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:z-10 hover:shadow-[4px_4px_0_0_var(--text-primary)]`;

export const shadowLiftCardStyle = `transition-all duration-600 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:z-10 hover:shadow-[4px_4px_0_0_var(--text-tertiary)]`;

// для button-элементов С disabled-состоянием
export const shadowLiftButtonStyle = `transition-all duration-600 ease-in-out
enabled:hover:-translate-x-1
enabled:hover:-translate-y-1
enabled:hover:z-10
enabled:hover:shadow-[4px_4px_0_0_var(--text-primary)]
enabled:cursor-pointer
disabled:bg-(--bg-disable-btn)`;

// Example
// <FunctionBtn
//   Icon={PlusIcon}
//   iconClassName={"w-5 h-5"}
//   text={"Создать заявку"}
//   textClassName={"text-sm dark:text-(--bg-primary) text-(--text-primary) font-jbmono font-extrabold select-none"}
//   btnClassName={`h-10 w-47.5  rounded-xs flex justify-center items-center px-6 py-3 gap-2
//     ${shadowLiftButtonStyle}
//     enabled:bg-(--bg-btn-primary)
//     disabled:bg-(--bg-disable-btn)
//     enabled:cursor-pointer`}
//   innerDivClassName={"flex items-center gap-1"}
//   onClick={() => navigate("/tickets/new")}
//   disabled={isOnCreatePage}
// />
