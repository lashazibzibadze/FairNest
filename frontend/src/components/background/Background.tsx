import "./Background.css";

const Background = () => {
  const backgroundImage = "/Background/NYC_Sketch.jpg";

  return (
    <div
      className="absolute top-0 left-0 w-full h-screen -z-10 overflow-hidden bg-cover bg-center bg-no-repeat brightness-75"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
  );
};

export default Background;