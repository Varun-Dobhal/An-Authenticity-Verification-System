import { Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import ManufacturerDashboard from "./components/ManufacturerDashboard";
import ConsumerInterface from "./components/ConsumerInterface";
import Analytics from "./components/Analytics";
import LoginForm from "./components/login-form";
import SignupForm from "./components/signup-form";
import About from "./components/About";
import Footer from "./components/Footer";
import Home from "./components/Home";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {(location.pathname === "/manufacturer" ||
        location.pathname === "/consumer" ||
        location.pathname === "/analytics" ||
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/about") && <Navigation />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manufacturer" element={<ManufacturerDashboard />} />
        <Route path="/consumer" element={<ConsumerInterface />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/about" element={<About />} />
      </Routes>
      {location.pathname === "/" && <Footer />}
    </div>
  );
}

export default App;
