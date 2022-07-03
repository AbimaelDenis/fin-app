import React from "react";

import Card from "../components/card";
import FormGroup from "../components/form-group";
import { Navigate } from 'react-router-dom';

import UsuarioService from "../app/service/usuarioService";

import { mensagemErro } from '../components/toastr'
import { AuthContext } from "../main/provedorAutenticacao";


class Login extends React.Component{
  
    state = {
        email: '',
        senha: '',  
        menssagemErro: null,
        redirect: ''
    }

    constructor(){
        super();
        this.service = new UsuarioService();
    }

    entrar = async () => {
        this.service.autenticar({
            email: this.state.email,
            senha: this.state.senha
        }).then(response => {
            this.context.iniciarSessao(response.data)
            this.redirect('/home')
        }).catch( erro => {
            mensagemErro(erro.response.data)
        })}

    redirect = (path) => {
        this.setState({redirect: path})
    }

    render(){
        if(this.state.redirect){
            return(<Navigate to={this.state.redirect} replace={true}/>);
        }
        return(      
            <div className="row">
                <div className="col-md-6" style={{position: 'relative', left:'300px'}}>
                    <div className="bs-docs-section">
                        <Card title="Login">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bs-component">
                                        <fieldset>
                                            <FormGroup label="Email: *" htmlFor="exampleInputEmail">
                                                <input type="email" 
                                                        value={this.state.email}
                                                        onChange={e => this.setState({email: e.target.value})}
                                                        className="form-control" 
                                                        id="exampleInputEmail"
                                                        aria-describedby="emailHelp" 
                                                        placeholder="Digite o Email"/>   
                                            </FormGroup>
                                            <br/>
                                            <FormGroup label="Senha: *" htmlFor="exampleInpuPassword">
                                                <input type="password" 
                                                        value={this.state.senha}
                                                        onChange={e => this.setState({senha: e.target.value})}
                                                        className="form-control" 
                                                        id="exampleInputPassword"
                                                        placeholder="Password"/>
                                            </FormGroup>   
                                            <br/>            
                                            <button onClick={this.entrar} className="btn btn-success">
                                                <i className="pi pi-sign-in"></i> Entrar
                                            </button>
                                            <button onClick={() => {this.redirect('/cadastro-usuario')}} className="btn btn-danger">
                                                <i className="pi pi-plus"></i> Cadastrar
                                            </button>       
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>       
        )
    }
}

Login.contextType = AuthContext // inscreve o login no contexto de autenticacao

export default Login