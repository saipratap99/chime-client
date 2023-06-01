import { useState } from "react";
import JoinMeetingFromComponent from "../../components/JoinMeeting/JoinMeetingForm";
import { MeetingForm } from "../../models/meetingForm";
import { joinMeetingService } from "../../services/joinMeetingService";
import { useNavigate } from "react-router-dom";

const JoinMeetingForm = (props: any) => {
  const meetingFormInitial: MeetingForm = {
    title: "",
    name: "",
    region: "",
  };
  const [meetingForm, setMeetingForm] = useState(meetingFormInitial);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const navigate = useNavigate();

  function submitMeetingForm(e: any, submittedMeetingForm: MeetingForm) {
    e.preventDefault();
    setMeetingForm(submittedMeetingForm);
    console.log("Meeting form data", submittedMeetingForm);
    const meetingResponse = joinMeetingService
      .joinMeeting(submittedMeetingForm)
      .then((data) => {
        console.log("Then", data);
        if (data) {
          setMeetingInfo(data.data);
          navigate("/in-meeting", {
            state: data?.data,
          });
        }
      });
  }
  return (
    <div>
      <JoinMeetingFromComponent
        submitMeetingForm={submitMeetingForm}
      ></JoinMeetingFromComponent>
    </div>
  );
};

export default JoinMeetingForm;
