import './App.css';
import AddressBookForm from "./components/address-book-form/address-book-form";
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect
} from "react-router-dom";

function App() {
  return (
    <div className="App">
     <Router>
        <Switch>
          <Route exact path = ""><AddressBookForm /></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;