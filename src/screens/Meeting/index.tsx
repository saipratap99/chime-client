import { useEffect, useState } from "react";
import AudioComponent from "../../components/Audio/AudioComponent";
import VideoComponent from "../../components/Video/VideoComponent";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { useLocation } from "react-router-dom";
import ChimeService from "../../services/chimeService";
import AttendeeService from "../../services/attendeeService";
import { JSX } from "react/jsx-runtime";

const Meeting = () => {
  const [meetingSession, setMeetingSession] = useState<DefaultMeetingSession>();
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [chimeService, setChimeService] = useState<ChimeService>();
  const [attendeeService, setAttendeeService] = useState<AttendeeService>();
  const [videoComponents, setVideoComponents] = useState<JSX.Element[]>([]);

  const params = useLocation();
  useEffect(() => {
    console.log("Prams state", params, params?.state);
    if (params?.state) {
      setMeetingInfo(meetingInfo);
      createMeetingSession(params?.state).then((data) => {
        console.log("Create meeting session success");
      });
    }

    // creating 25 video elements
    let videoElements = [];
    for (let i = 0; i < 24; i++) {
      const id = `myVideo${i + 1}`;
      videoElements.push(
        <VideoComponent id={id} width="320" height="240"></VideoComponent>
      );
    }
    setVideoComponents(videoElements);
  }, []);

  useEffect(() => {
    if (meetingSession) {
      const chime = new ChimeService(meetingSession);

      chime.selectAudioVideo().then((data) => chime.bindAudioAndVideo());
      const attendee = new AttendeeService(meetingSession);
      setAttendeeService(attendee);
      setChimeService(chime);
    }
  }, [meetingSession]);

  async function createMeetingSession(meetingInfo: any) {
    const logger = new ConsoleLogger("MyLogger", LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    const configuration = new MeetingSessionConfiguration(
      meetingInfo.JoinInfo.Meeting,
      meetingInfo.JoinInfo.Attendee
    );
    console.log("Inside create meeting session");
    setMeetingSession(
      new DefaultMeetingSession(configuration, logger, deviceController)
    );
  }

  return (
    <div className="p-3">
      <h4 className="text-muted">In Meeting </h4>
      <div>
        <VideoComponent id="myVideo" width="320" height="240"></VideoComponent>
        {videoComponents}
      </div>
      <div>
        <AudioComponent id="myAudio" />
      </div>
    </div>
  );
};

export default Meeting;
