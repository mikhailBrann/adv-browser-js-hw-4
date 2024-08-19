import "../components/CartWidget/css/style.css";
import CardWidget from "../components/CartWidget/CardWidget";

document.addEventListener("DOMContentLoaded", () => {
  new CardWidget(document.querySelector(".widget-card"));
});
