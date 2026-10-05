import { useNavigate } from "react-router";
import { shadowLiftButtonStyle } from "../../styles/shadowLift";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none">
      <img
        src="src\assets\404error.png"
        alt=""
        className="object-contain w-175 max-w-full
h-175 max-h-full select-none"
      />

      <button
        onClick={() => navigate("/")}
        className={`h-10 w-47.5 rounded-xs flex justify-center items-center px-6 py-3 gap-2
              ${shadowLiftButtonStyle}
              bg-[#30bad7]`}
      >
        <span className="text-base dark:text-(--bg-primary) text-(--text-primary) font-jbmono font-extrabold select-none">
          На главную
        </span>
      </button>
    </div>
  );
}

export default NotFoundPage;
