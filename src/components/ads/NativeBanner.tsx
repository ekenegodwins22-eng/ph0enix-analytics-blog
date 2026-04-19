import { useEffect } from "react";

const SCRIPT_ID = "profitablecpm-native-banner";
const SCRIPT_SRC =
  "https://pl29189058.profitablecpmratenetwork.com/12c5ca64dab4ee0a06a7de2dffc952ca/invoke.js";
const CONTAINER_ID = "container-12c5ca64dab4ee0a06a7de2dffc952ca";

/**
 * ProfitableCPM Native Banner ad slot.
 * Loads the invoke.js script once and renders the container where placed.
 */
export const NativeBanner = () => {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = SCRIPT_SRC;
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    document.body.appendChild(s);
  }, []);

  return (
    <div className="w-full my-8 flex justify-center">
      <div id={CONTAINER_ID} className="w-full max-w-4xl" />
    </div>
  );
};
