import { Prism } from "react-syntax-highlighter";
import xonokai from "react-syntax-highlighter/dist/styles/prism/xonokai";

const Renderer = ({ code, language = "javascript", fontSize = "1.75rem" }) => {
  return (
    <Prism
      language={language}
      style={xonokai}
      customStyle={{ fontSize }}
      codeTagProps={{ fontSize: "inherit" }}
    >
      {code}
    </Prism>
  );
};

export default Renderer;
