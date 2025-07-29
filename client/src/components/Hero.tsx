import banner from "../assets/banner.jpg";

const Hero = () => {
  const myStyle = {
    backgroundImage: `url(${banner}`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  };
  return (
    <div className="mx-8 my-2">
      <div
        className="px-14 py-10 flex flex-col gap-3  font-mono rounded-xl"
        style={myStyle}
      >
        <h1 className="text-4xl text-[#b9d4ee]">
          Test your knowledge with
          <span className="block mt-3">Quizzes</span>
        </h1>
        <p className="text-[#b9d4ee] leading-6 my-2">
          You are looking for a playful way to learn <br />
          new fact, our quizzes are designed to
          <br />
          entertain and educate
        </p>
        <button className="bg-white rounded-md text-xl w-[140px] py-2 text-[#17386d]">
          Play now
        </button>
      </div>
    </div>
  );
};

export default Hero;
