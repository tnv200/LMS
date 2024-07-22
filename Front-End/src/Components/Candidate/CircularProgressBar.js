import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgressBar = ({ percentage }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    // Animate the progress bar from 0 to the desired percentage
    const animationDuration = 1000; // Adjust the animation duration in milliseconds
    let startTimestamp;

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      setAnimatedPercentage((progress / animationDuration) * percentage);

      if (progress < animationDuration) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedPercentage(percentage);
      }
    };

    requestAnimationFrame(animate);

    // Cleanup the animation when the component unmounts
    return () => cancelAnimationFrame(animate);
  }, [percentage]);

  return (
    <div className="circular-progress-bar-container">
      <CircularProgressbar
        value={animatedPercentage}
        text={`${animatedPercentage.toFixed(0)}%`}
        styles={buildStyles({
          textSize: "16px",
          pathColor: `rgba(${255 - (animatedPercentage * 255) / 100}, ${
            (animatedPercentage * 255) / 100
          }, 0, 1)`, // Red to Green gradient
          textColor: "#333", // Adjust the text color
          trailColor: "#d6d6d6", // Adjust the trail color
        })}
      />
    </div>
  );
};

export default CircularProgressBar;
