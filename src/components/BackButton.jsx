import { useLocation, useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleBack() {
    // If there is a previous page in the browser history,
    // go back to it.
    if (location.key !== "default") {
      navigate(-1);
      return;
    }

    // If the page was opened directly,
    // go back to Home.
    navigate("/");
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-blue-600"
    >
      <span className="text-lg">←</span>

      <span>Back</span>
    </button>
  );
}