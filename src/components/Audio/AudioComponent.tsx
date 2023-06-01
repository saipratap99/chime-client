interface AudioComponentProps {
  id: string;
}
const AudioComponent = (props: AudioComponentProps) => {
  return (
    <audio id="myAudio">Your browser does not support the audio tag.</audio>
  );
};

export default AudioComponent;
