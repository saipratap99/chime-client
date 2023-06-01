import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import HelloWorld from "../components/HelloWorld";
import JoinMeetingForm from "../components/JoinMeeting/JoinMeetingForm";

export default function AppRouter() {
  return (
    <Router>
        <Routes>
          <Route path="/hello" Component={HelloWorld}/>
          <Route path="/join" Component={JoinMeetingForm}/>
        </Routes>
    </Router>
  );
}

