import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";
import WebFont from 'webfontloader';

WebFont.load({ google: { families: ["Roboto:300,400,500"] } });

function App() {
  const routes = useRoutes(false);
  return (
      <BrowserRouter>
        <div className="App">
          {routes}
        </div>
      </BrowserRouter>
  );
}

export default App;
