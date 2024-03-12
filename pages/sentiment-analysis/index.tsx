import React, { useEffect } from "react";
import Gist from "react-gist";

const Sentiment = () => {
  return (
    <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 pt-6 w-full">
      <GistEmbed gistId={"7e38d7fea00fbc548e284d8fc07cebd1"} />
    </div>
  );
};

export default Sentiment;

const GistEmbed = ({ gistId }: any) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://gist.github.com/${gistId}.js`;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [gistId]);

  return (
    <div className="flex flex-col gap-y-4">
      <Gist id={gistId} />

      <iframe
        title="Portfolio"
        src={process.env.NEXT_PUBLIC_EMBED_URL}
        style={{ width: "100%", height: "300px", borderRadius: "10px" }}
        frameBorder="0"
        scrolling="auto"
      ></iframe>
    </div>
  );
};
