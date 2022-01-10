import SignUp from "./components/AuthPages/SignUp";
import SignIn from "./components/AuthPages/SignIn";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import ModuleRoutes from "./routes";

function App() {
  return (
    <>
      <ToastContainer />
      <ModuleRoutes />
    </>
  );
}

export default App;
