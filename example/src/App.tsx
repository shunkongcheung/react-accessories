import React from "react";
import { AuthContextProvider, useAuthContext } from "test-module";

interface User {
  name: string;
  iat: number;
}

function Child() {
  const [val, setVal] = React.useState(false);
  const { handleTokenChange, userInfo, token, isLogined } = useAuthContext<
    User
  >();
  const testToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  return (
    <div>
      <div>hello world </div>
      <pre>{JSON.stringify(userInfo, null, 4)}</pre>
      <div>{token}</div>
      <div>{isLogined ? "is" : "not"} logined</div>
      <button onClick={() => handleTokenChange(token ? "" : testToken)}>
        click me{" "}
      </button>
      <div style={{ marginTop: 200 }} />
      <div>{val ? "true" : "false"}</div>
      <button onClick={() => setVal(o => !o)}>click me </button>
    </div>
  );
}

function App() {
  return (
    <AuthContextProvider defaultUser={{ name: "", iat: -1 }}>
      <Child />
    </AuthContextProvider>
  );
}

export default App;
