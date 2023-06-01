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

const Meeting = () => {
  const [meetingSession, setMeetingSession] = useState<DefaultMeetingSession>();
  const [meetingInfo, setMeetingInfo] = useState(null);

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
    selectAudioVideo().then((data) => bindAudioAndVideo());
  }, [meetingSession]);

  const audioVideoObserver: any = {
    audioInputsChanged: (freshAudioInputDeviceList: any) => {
      // An array of MediaDeviceInfo objects
      freshAudioInputDeviceList.forEach((mediaDeviceInfo: MediaDeviceInfo) => {
        console.log(
          `Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`
        );
      });
    },

    audioOutputsChanged: (freshAudioOutputDeviceList: any) => {
      console.log("Audio outputs updated: ", freshAudioOutputDeviceList);
    },

    videoInputsChanged: (freshVideoInputDeviceList: any) => {
      console.log("Video inputs updated: ", freshVideoInputDeviceList);
    },

    audioInputMuteStateChanged: (device: MediaDeviceInfo, muted: boolean) => {
      console.log(
        "Device",
        device,
        muted ? "is muted in hardware" : "is not muted"
      );
    },
  };

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
    meetingSession?.audioVideo.addDeviceChangeObserver(audioVideoObserver);
  }

  async function getAudioInputDevices(): Promise<
    MediaDeviceInfo[] | undefined
  > {
    const audioInputDevices =
      meetingSession?.audioVideo.listAudioInputDevices();

    return audioInputDevices?.then((data) => {
      console.log("Audio Input Devices data", data);
      return data;
    });
  }

  async function getAudioOutputDevices(): Promise<
    MediaDeviceInfo[] | undefined
  > {
    const audioOutputDevices =
      meetingSession?.audioVideo.listAudioOutputDevices();

    return audioOutputDevices?.then((data) => {
      console.log("Audio Output devices", data);
      return data;
    });
  }

  async function getVideoInputDevices(): Promise<
    MediaDeviceInfo[] | undefined
  > {
    const videoInputDevices =
      meetingSession?.audioVideo.listVideoInputDevices();
    return videoInputDevices?.then((data) => {
      console.log("Video InputDevices devices", data);
      return data;
    });
  }

  // selecting audio input and audio output devices
  // selecting video input devices
  async function selectAudioVideo() {
    console.log("Select audio video");
    getAudioInputDevices().then((audioInputDevices) => {
      if (audioInputDevices)
        meetingSession?.audioVideo.startAudioInput(
          audioInputDevices[0].deviceId
        );
    });
    getAudioOutputDevices().then((audioOutputDevices) => {
      if (audioOutputDevices && audioOutputDevices.length > 0)
        meetingSession?.audioVideo.chooseAudioOutput(
          audioOutputDevices[0].deviceId
        );
    });

    getVideoInputDevices().then((videoInputDevices) => {
      if (videoInputDevices && videoInputDevices.length > 0) {
        meetingSession?.audioVideo
          .startVideoInput(videoInputDevices[0].deviceId)
          .then((data) => {
            // it will turn off indicating the camera is no longer capturing.
            // meetingSession?.audioVideo.stopVideoInput();
          });
      }
    });
  }

  async function bindAudioAndVideo() {
    console.log("bind audio video");
    const myAudioElement = document.getElementById(
      "myAudio"
    ) as HTMLAudioElement;
    const myVideoElement = document.getElementById(
      "myVideo"
    ) as HTMLVideoElement;

    if (myAudioElement) {
      console.log("My audio element");
      meetingSession?.audioVideo.bindAudioElement(myAudioElement);
    }

    if (myVideoElement)
      meetingSession?.audioVideo.bindVideoElement(1, myVideoElement);

    const observer = {
      audioVideoDidStart: () => {
        console.log("Started");
      },
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: (tileState: any) => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }

        meetingSession?.audioVideo.bindVideoElement(
          tileState.tileId,
          myVideoElement
        );
      },
    };

    meetingSession?.audioVideo.addObserver(observer);
    meetingSession?.audioVideo.start();
    meetingSession?.audioVideo.startLocalVideoTile();
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
