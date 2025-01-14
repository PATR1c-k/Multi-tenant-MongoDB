import "./App.css";
import TenantForm from "./components/TenantForm.jsx";
import CustomerForm from "./components/CustomerForm.jsx";
import CustomerList from "./components/CustomerList.jsx";

function App() {
  return (
    <div className="container">
      <h2>Working of MultiTenant Architecture</h2>
      <TenantForm />
      <CustomerForm />
      <h3>You can check Customer Data from here</h3>
      <CustomerList />
    </div>
  );
}

export default App;
