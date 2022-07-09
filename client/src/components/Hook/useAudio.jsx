import { useState, useEffect } from "react";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (playing) {
      audio.play();
      audio.loop = true;
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [playing, audio]);

  return [playing, setPlaying];
};

export { useAudio };
