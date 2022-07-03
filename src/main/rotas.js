import React, { useContext, useState } from 'react'
import { BrowserRouter, Routes,  Route, Navigate, Outlet } from "react-router-dom";


import Home from '../views/home'
import Login from '../views/login'
import CadastroUsuario from '../views/cadastroUsuario'
import ConsultaLancamentos from '../views/lancamentos/consulta-lancamentos';
import CadastroLancamentos from '../views/lancamentos/cadastro-lancamentos'
import AuthService from '../app/service/authService';
import {AuthConsumer} from './provedorAutenticacao'

const RotaAutenticada = ({auth}) => {
    return auth ? <Outlet/> : <Navigate to='/login'/>
}


function Rotas(props){
    //window.location.href
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/cadastro-usuario" element={<CadastroUsuario/>}/>

                <Route path="/home" element={<RotaAutenticada auth={props.isUsuarioAutenticado}/>}>
                    <Route path="/home" element={<Home/>}/>
                </Route>
                <Route path="/consulta-lancamentos" element={<RotaAutenticada auth={props.isUsuarioAutenticado}/>}>
                    <Route path="/consulta-lancamentos" element={<ConsultaLancamentos/>}/>
                </Route>
                <Route path="/cadastro-lancamentos" element={<RotaAutenticada auth={props.isUsuarioAutenticado}/>}>
                    <Route path="/cadastro-lancamentos" element={<CadastroLancamentos/>}/>
                </Route>
                <Route path="/cadastro-lancamentos/:id" element={<RotaAutenticada auth={props.isUsuarioAutenticado}/>}>
                    <Route path="/cadastro-lancamentos/:id" element={<CadastroLancamentos/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}



export default () => (
    <AuthConsumer>
        { (context) => (<Rotas isUsuarioAutenticado={context.isAutenticado}/>) }
    </AuthConsumer>
)