import "./styles.scss";
import loader from "../../assests/loader.svg";

export const Loader = () => {
  return (
    <div className="loader-container">
      <img src={loader} />
    </div>
  );
};
