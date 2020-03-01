# Project Title

A react accessories library for making CRUD restful call and handling authentication

## Getting Started

no content yet

### Installing

no content yet

## Usage

```
import { AuthContextProvider, useAuthContext } from "react-accessory";

interface User {
  name: string;
  iat: number;
}
function Child() {
  const auth = useAuthContext<User>();
  const { handleTokenChange, userInfo, token, isLogined } = auth;
   return (
        <>
          <pre>{JSON.stringify(userInfo, null, 4)}</pre>
          <button onClick={() => handleTokenChange('')}>logout</button>
        </>
  );
}

function App() {
  return (
    <AuthContextProvider defaultUser={{ name: "", iat: -1 }}>
      <Child />
    </AuthContextProvider>
  );
}
```

### Authentication
* `handleTokenChange`: actively update token, can be used for logout
* `userInfo`: decoded information inside token
* `isLogined`: true if token is not empty


## Built With

* [React](http://https://reactjs.org/) - A JavaScript library for building user interfaces

## Authors

* **Shun Kong Cheung** - *Initial work* - [shunkongcheung](https://github.com/shunkongcheung)

See also the list of [contributors](https://github.com/shunkongcheung/react-accessories) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Create based on [this](https://www.pluralsight.com/guides/react-typescript-module-create) example
