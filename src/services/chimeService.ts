import { DefaultMeetingSession } from "amazon-chime-sdk-js";

class ChimeService {
  public audioVideoObserver: any;
  constructor(private meetingSession: DefaultMeetingSession) {
    this.audioVideoObserver = {
      audioInputsChanged: (freshAudioInputDeviceList: any) => {
        // An array of MediaDeviceInfo objects
        freshAudioInputDeviceList.forEach(
          (mediaDeviceInfo: MediaDeviceInfo) => {
            console.log(
              `Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`
            );
          }
        );
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

    this.meetingSession?.audioVideo.addDeviceChangeObserver(
      this.audioVideoObserver
    );
  }

  async getAudioInputDevices(): Promise<MediaDeviceInfo[] | undefined> {
    const audioInputDevices =
      this.meetingSession?.audioVideo.listAudioInputDevices();

    return audioInputDevices?.then((data) => {
      console.log("Audio Input Devices data", data);
      return data;
    });
  }

  async getAudioOutputDevices(): Promise<MediaDeviceInfo[] | undefined> {
    const audioOutputDevices =
      this.meetingSession?.audioVideo.listAudioOutputDevices();

    return audioOutputDevices?.then((data: any) => {
      console.log("Audio Output devices", data);
      return data;
    });
  }

  async getVideoInputDevices(): Promise<MediaDeviceInfo[] | undefined> {
    const videoInputDevices =
      this.meetingSession?.audioVideo.listVideoInputDevices();
    return videoInputDevices?.then((data) => {
      console.log("Video InputDevices devices", data);
      return data;
    });
  }

  // selecting audio input and audio output devices
  // selecting video input devices
  async selectAudioVideo() {
    console.log("Select audio video");
    this.getAudioInputDevices().then((audioInputDevices) => {
      if (audioInputDevices)
        this.meetingSession?.audioVideo.startAudioInput(
          audioInputDevices[0].deviceId
        );
    });
    this.getAudioOutputDevices().then((audioOutputDevices) => {
      if (audioOutputDevices && audioOutputDevices.length > 0)
        this.meetingSession?.audioVideo.chooseAudioOutput(
          audioOutputDevices[0].deviceId
        );
    });

    this.getVideoInputDevices().then((videoInputDevices) => {
      if (videoInputDevices && videoInputDevices.length > 0) {
        this.meetingSession?.audioVideo
          .startVideoInput(videoInputDevices[0].deviceId)
          .then((data) => {
            // it will turn off indicating the camera is no longer capturing.
            // meetingSession?.audioVideo.stopVideoInput();
          });
      }
    });
  }

  async bindAudioAndVideo(videoId = "myVideo", audioId = "myAudio") {
    console.log("bind audio video");
    const myAudioElement = document.getElementById(audioId) as HTMLAudioElement;
    const myVideoElement = document.getElementById(videoId) as HTMLVideoElement;

    if (myAudioElement) {
      this.meetingSession?.audioVideo.bindAudioElement(myAudioElement);
    }

    if (myVideoElement)
      this.meetingSession?.audioVideo.bindVideoElement(1, myVideoElement);

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

        this.meetingSession?.audioVideo.bindVideoElement(
          tileState.tileId,
          myVideoElement
        );
      },
    };

    this.meetingSession?.audioVideo.addObserver(observer);
    this.meetingSession?.audioVideo.start();
    this.meetingSession?.audioVideo.startLocalVideoTile();
  }
}

export default ChimeService;
