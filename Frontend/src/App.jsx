import React from "react";
import Customer from "./customerpage/CustomerNavbar";
import Admin from "./adminpage/AdminNavbar";
import Owner from "./ownerpage/OwnerNavbar";
import Login from "./customerpage/CustomerLogin"
import Register from "./customerpage/CustomerRegister"
import Cart from "./customerpage/Cart"
import MyOrders from "./customerpage/MyOrders"
import { Routes, Route } from 'react-router-dom'
import Myfavorites from "./customerpage/Myfavorites"
import Home from "./customerpage/Home"
import Orders from "./ownerpage/Orders"
import OwnerLogin from "./ownerpage/OwnerLogin"
import OwnerRegister from "./ownerpage/OwnerRegister"
import AddItem from "./ownerpage/AddItem"
import Activities from "./adminpage/Activities"
import KitchenOwners from "./adminpage/KitchenOwners"
import AdminLogin from "./adminpage/AdminLogin"
import MyKitchen from "./ownerpage/MyKitchen"
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Customer />}>
          <Route index element={<Home />} />
          <Route path="customerregister" element={<Register />} />
          <Route path="customerlogin" element={<Login />} />
          <Route path="myfavorites" element={<Myfavorites />} />
          <Route path="cart" element={<Cart />} />
          <Route path="myorders" element={<MyOrders />} />
        </Route>
        <Route path="/owner" element={<Owner />} >
        <Route index element={<OwnerRegister />} />
          <Route path="register" element={<OwnerRegister />} />
          <Route path="login" element={<OwnerLogin />} />
          <Route path="kitchen" element={<MyKitchen />} />
          <Route path="orders" element={<Orders />} />
          <Route path="additem" element={<AddItem />} />
        </Route>
        <Route path="/adminpage" element={<Admin />}>
        <Route index element={<AdminLogin />} />
         <Route path="kitchenowners" element={<KitchenOwners />} />
         <Route path="activities" element={<Activities />} />
         
        </Route>
      </Routes>

    </div>

  );
};

export default App;
