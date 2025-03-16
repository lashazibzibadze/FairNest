import "./Background.css";

const Background = () => {
  const backgroundImage = "/Background/NYC_Sketch.jpg";

  return (
    <div
      className="absolute top-0 left-0 w-full h-screen -z-10 overflow-hidden brightness-75 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
  );
};

export default Background;