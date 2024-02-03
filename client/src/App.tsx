import { RouterProvider } from "react-router-dom";

import { useTypedSelector } from "./redux/store";
import router from "./routes";
import { AuthState } from "./models/custom";

function App() {
  const authState: AuthState = useTypedSelector((state) => state.authState);

  return (
    <>
      <RouterProvider router={router(authState)} />
    </>
  );
}

export default App;
