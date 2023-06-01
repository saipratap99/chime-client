import axios from "axios";
import { MeetingForm } from "../models/meetingForm";
import { BACKEND_URL } from "../common/constants";

class JoinMeetingService {
  async joinMeeting(meetingForm: MeetingForm) {
    try {
      return await axios.post(
        `${BACKEND_URL}/join?title=${meetingForm.title}&name=${meetingForm.name}&region=${meetingForm.region}`
      );
    } catch (error) {
      console.log("Error", error);
      return null;
    }
  }
}

export const joinMeetingService = new JoinMeetingService();
