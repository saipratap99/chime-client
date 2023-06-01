import { useEffect, useState } from "react";
import "./JoinMeetingFormStyle.css";
import { MeetingForm } from "../../models/meetingForm";
import { joinMeetingService } from "../../services/joinMeetingService";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";

function JoinMeetingForm() {
  const meetingFormInitial: MeetingForm = {
    title: "",
    name: "",
    region: "",
  };

  const [meetingForm, setMeetingForm] = useState(meetingFormInitial);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [meetingSession, setMeetingSession] = useState<DefaultMeetingSession>();

  useEffect(() => {
    console.log("Meeting Info", meetingInfo);
    if (meetingInfo)
      createMeetingSession(meetingInfo).then((data) => {
        selectAudioVideo().then((data) => bindAudioAndVideo());
      });
  }, [meetingInfo]);

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

  function onChangeMeetingFormHandler(e: any) {
    let targetValue = e.target.value;
    let targetName = e.target.name;

    let meetingFormUpdated: any = {
      ...meetingForm,
    };
    meetingFormUpdated[targetName] = targetValue;

    setMeetingForm(meetingFormUpdated);
  }

  async function submitMeetingForm(e: any) {
    e.preventDefault();
    console.log("Meeting form data", meetingForm);
    const meetingResponse = joinMeetingService
      .joinMeeting(meetingForm)
      .then((data) => {
        console.log("Then", data);
        if (data) {
          setMeetingInfo(data?.data);
        }
      });
  }
  async function createMeetingSession(meetingInfo: any) {
    const logger = new ConsoleLogger("MyLogger", LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    const configuration = new MeetingSessionConfiguration(
      meetingInfo.JoinInfo.Meeting,
      meetingInfo.JoinInfo.Attendee
    );
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
    const myAudioElement = document.getElementById(
      "myAudio"
    ) as HTMLAudioElement;
    const myVideoElement = document.getElementById(
      "myVideo"
    ) as HTMLVideoElement;

    if (myAudioElement)
      meetingSession?.audioVideo.bindAudioElement(myAudioElement);
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
    <div className="container">
      <div>
        <div className="">
          <h2 className="text-primary text-center">Join Meeting</h2>
          <form
            onSubmit={submitMeetingForm}
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
      <div>
        <div>
          <video id="myVideo" width="320" height="240">
            Your browser does not support the video tag.
          </video>
          <audio id="myAudio">
            Your browser does not support the video tag.
          </audio>
        </div>
      </div>
    </div>
  );
}

export default JoinMeetingForm;
