import { useState } from "react";
import "./JoinMeetingFormStyle.css";
import { MeetingForm } from "../../models/meetingForm";
import { joinMeetingService } from "../../services/joinMeetingService";

interface JoinMeetingFormProps {
  submitMeetingForm: any;
}
function JoinMeetingFromComponent(props: JoinMeetingFormProps) {
  let meetingFormInitial: MeetingForm = {
    title: "",
    name: "",
    region: "",
  };

  const [meetingForm, setMeetingForm] = useState(meetingFormInitial);

  // useEffect(() => {
  //   console.log("Meeting Info", meetingInfo);
  //   if (meetingInfo)
  //     createMeetingSession(meetingInfo).then((data) => {
  //       selectAudioVideo().then((data) => bindAudioAndVideo());
  //     });
  // }, [meetingInfo]);

  function onChangeMeetingFormHandler(e: any) {
    let targetValue = e.target.value;
    let targetName = e.target.name;

    let meetingFormUpdated: any = {
      ...meetingForm,
    };
    meetingFormUpdated[targetName] = targetValue;

    setMeetingForm(meetingFormUpdated);
  }

  return (
    <div className="container">
      <div>
        <div className="">
          <h2 className="text-primary text-center">Join Meeting</h2>
          <form
            onSubmit={(e) => props.submitMeetingForm(e, meetingForm)}
            className="w-50 w-lg-25 w-xl-25 border p-3 mx-auto"
          >
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={meetingForm.title}
                onChange={onChangeMeetingFormHandler}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={meetingForm.name}
                onChange={onChangeMeetingFormHandler}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Region</label>
              <input
                type="text"
                name="region"
                className="form-control"
                value={meetingForm.region}
                onChange={onChangeMeetingFormHandler}
              />
            </div>
            <input
              type="submit"
              value="Submit"
              className="btn btn-primary text-center w-100"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinMeetingFromComponent;
