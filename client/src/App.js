import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Login from "./components/Login/login";
import Register from "./components/Register/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<ProductList/>}/>
        <Route path="add" element={<AddProduct/>}/>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route path="edit/:id" element={<EditProduct/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
