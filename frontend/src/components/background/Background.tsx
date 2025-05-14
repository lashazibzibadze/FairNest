import "./Background.css";

const Background = () => {
  const backgroundImage = "/Background/NYC_Sketch_1.webp";

  return (
    <div className="absolute top-0 left-0 w-full h-screen -z-10 overflow-hidden bg-gray-300">
      {/*background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-gray-300"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/*Tint to match other pages */}
      <div className="absolute inset-0 bg-gray-300/20" />
    </div>
  );
};

export default Background;
