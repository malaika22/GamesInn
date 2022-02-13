import SignUp from "./components/AuthPages/SignUp";
import SignIn from "./components/AuthPages/SignIn";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import ModuleRoutes from "./routes";
import { AuthContextProvider } from "./context/AuthContext";
import { GamerContextProvider } from "./context/GamerContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <GamerContextProvider>
          <ToastContainer />
          <ModuleRoutes />
        </GamerContextProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
