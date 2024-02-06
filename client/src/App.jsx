import React from 'react'
import {  Route, Routes } from "react-router-dom"
import Home from "./Pages/Home/Home"
import SignUp from './Pages/SignUp/SignUp'
import SignIn from './Pages/SignIn/SignIn'

export default function App() {
  return (
    <div>
       <Routes>
       <Route exact path="/" element={<Home/> }/>
        <Route exact path="/signin" element={<SignIn/> }/>
        <Route exact path="/signup" element={<SignUp/>}/>
      </Routes>
    </div>
  )
}
