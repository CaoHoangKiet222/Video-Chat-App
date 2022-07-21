import React, { useEffect, useRef } from "react";

import data from "@emoji-mart/data/sets/14/facebook.json";
import { Picker } from "emoji-mart";

const EmojiPicker = (props) => {
  const ref = useRef();
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;

    new Picker({
      ...props,
      data,
      ref,
      theme: "dark",
      set: "facebook",
      perLine: 12,
    });

    executedRef.current = true;
  }, [props]);

  return <div ref={ref} />;
};

export default EmojiPicker;
