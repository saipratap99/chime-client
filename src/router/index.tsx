import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import HelloWorld from "../components/HelloWorld";
import JoinMeetingForm from "../screens/JoinMeeting";
import Meeting from "../screens/Meeting";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/hello" Component={HelloWorld} />
        <Route path="/join" Component={JoinMeetingForm} />
        <Route path="/in-meeting" Component={Meeting} />
      </Routes>
    </Router>
  );
}
