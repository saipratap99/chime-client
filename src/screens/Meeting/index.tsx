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

const Meeting = () => {
  const [meetingSession, setMeetingSession] = useState<DefaultMeetingSession>();
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [chimeService, setChimeService] = useState();

  const params = useLocation();
  useEffect(() => {
    console.log("Prams state", params, params?.state);
    if (params?.state) {
      setMeetingInfo(meetingInfo);
      createMeetingSession(params?.state).then((data) => {
        console.log("Create meeting session success");
      });
    }
  }, []);

  useEffect(() => {
    if (meetingSession) {
      const chimeService = new ChimeService(meetingSession);
      chimeService
        .selectAudioVideo()
        .then((data) => chimeService.bindAudioAndVideo());
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
      </div>
      <div>
        <AudioComponent id="myAudio" />
      </div>
    </div>
  );
};

export default Meeting;
