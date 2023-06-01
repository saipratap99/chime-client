interface videoComponentProps {
  id: string;
  width: string;
  height: string;
}
const VideoComponent = (props: videoComponentProps) => {
  return (
    <video id={props.id} width={props.width} height={props.height}>
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoComponent;
