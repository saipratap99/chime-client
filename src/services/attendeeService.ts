import { DefaultMeetingSession } from "amazon-chime-sdk-js";

class AttendeeService {
  constructor(private meetingSession: DefaultMeetingSession) {
    this.meetingSession = meetingSession;
    const attendeePresenceSet = new Set();
    const callback = (presentAttendeeId: any, present: any) => {
      console.log(`Attendee ID: ${presentAttendeeId} Present: ${present}`);
      if (present) {
        attendeePresenceSet.add(presentAttendeeId);
      } else {
        attendeePresenceSet.delete(presentAttendeeId);
      }
    };

    this.meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(
      callback
    );

    // Binding video for the attendees
    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: (tileState: any) => {
        // Ignore a tile without attendee ID, a local tile (your video), and a content share.
        if (
          !tileState.boundAttendeeId ||
          tileState.localTile ||
          tileState.isContent
        ) {
          return;
        }

        meetingSession.audioVideo.bindVideoElement(
          tileState.tileId,
          this.acquireVideoElement(tileState.tileId)
        );
      },
      videoTileWasRemoved: (tileId: any) => {
        this.releaseVideoElement(tileId);
      },
    };

    meetingSession.audioVideo.addObserver(observer);
  }

  // index-tileId pairs
  indexMap: any = {};

  acquireVideoElement = (tileId: any) => {
    // Return the same video element if already bound.
    for (let i = 0; i < 25; i += 1) {
      if (this.indexMap[i] === tileId) {
        const videoId = `myVideo${i + 1}`;
        const videoElement = document.getElementById(
          videoId
        ) as HTMLVideoElement;
        return videoElement;
      }
    }
    // Return the next available video element.
    for (let i = 0; i < 25; i += 1) {
      if (!this.indexMap.hasOwnProperty(i)) {
        this.indexMap[i] = tileId;
        const videoId = `myVideo${i + 1}`;
        const videoElement = document.getElementById(
          videoId
        ) as HTMLVideoElement;
        return videoElement;
      }
    }
    throw new Error("no video element is available");
  };

  releaseVideoElement = (tileId: any) => {
    for (let i = 0; i < 25; i += 1) {
      if (this.indexMap[i] === tileId) {
        delete this.indexMap[i];
        return;
      }
    }
  };
}

export default AttendeeService;
