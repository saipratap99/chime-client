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
  }
}

export default AttendeeService;
