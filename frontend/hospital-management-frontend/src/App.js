import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PatientsPage from "./components/PatientsPage";
import PatientDetailsPage from "./components/PatientDetailsPage"; // import your new page
import DoctorsPage from "./components/DoctorsPage";
import AppointmentsPage from "./components/AppointmentsPage";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Hospital Management System</h1>
        <nav>
          <Link to="/patients"><button>Patients</button></Link>
          <Link to="/doctors"><button>Doctors</button></Link>
          <Link to="/appointments"><button>Appointments</button></Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientDetailsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="*" element={<PatientsPage />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
