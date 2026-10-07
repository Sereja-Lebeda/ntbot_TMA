import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

function useGoBack() {
  const location = useLocation();
  const navigate = useNavigate();

  const canGoBack = location.key !== "default";

  const goBack = useCallback(() => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }, [canGoBack, navigate]);

  return goBack;
}

export default useGoBack;
