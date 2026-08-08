import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);


//apiKey: "AIzaSyCIS08ylOb-XeE2W82cm2gidTF0ZWGtl4I",
//  authDomain: "lover-shop-54fcb.firebaseapp.com",
//  projectId: "lover-shop-54fcb",
//  storageBucket: "lover-shop-54fcb.firebasestorage.app",
//  messagingSenderId: "394332717120",
//  appId: "1:394332717120:web:95cf3645996c12b4b65fa5",
//  measurementId: "G-7GVWNHFBWR"