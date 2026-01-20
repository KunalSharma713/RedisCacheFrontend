import ProductTable from "./components/ProductTable";
import "./App.css";

function App() {
  return (
    <div className="app">
      <main className="main-content">
        <div className="table-header">
          <h2>Product Data Table</h2>
        </div>
        
        <ProductTable />
      </main>
    </div>
  );
}

export default App;
