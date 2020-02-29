import * as React from "react";

export interface Props {
  text: string;
}

const ExampleComponent: React.FC<Props> = props => {
  const { text } = props;
  return <div style={{ color: "red" }}>Hello {text}</div>;
};

export default ExampleComponent;
