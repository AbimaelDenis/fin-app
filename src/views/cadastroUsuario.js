import react from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { Link, Navigate } from 'react-router-dom'
import UsuarioService from '../app/service/usuarioService'
import { mensagemSucesso, mensagemErro } from '../components/toastr'

class CadastroUsuario extends react.Component{

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: '',
        redirect: null
    }

    constructor(){
        super()
        this.service = new UsuarioService();
    }

    cadastrar = () => {
        const {nome, email, senha, senhaRepeticao } = this.state
        const usuario = {nome, email, senha, senhaRepeticao}
        try{
        this.service.validar(usuario)
        }catch(erro){
            const msgs = erro.mensagens;
            msgs.forEach(msg => {mensagemErro(msg)});
            return false
        }

        this.service.salvar(usuario)
        .then(response => {
            mensagemSucesso("Usuário cadastrado com sucesso. Faça o login para acessar o sistema.")
            this.setState({redirect: true})
        }).catch(error =>{
            mensagemErro(error.response.data)
        })
    }
    
    render(){
        if(this.state.redirect){
            return(<Navigate to="/login" replace={true}/>)
        }
        return(         
            <Card title= 'Cadastro de Usuário'>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label= "Nome:*" htmlFor="inputNome">
                                <input  type="text"
                                        id="inputNome"
                                        className="form-control"
                                        name="nome"
                                        onChange={e => this.setState({nome: e.target.value})} />
                            </FormGroup>
                            <br/>
                            <FormGroup label= "Email:*" htmlFor="inputEmail">
                                <input  type="text"
                                        id="inputEmail"
                                        className="form-control"
                                        name="email"
                                        onChange={e => this.setState({email: e.target.value})} />
                            </FormGroup>
                            <br/>
                            <FormGroup label= "Senha*" htmlFor="inputEmail">
                                <input  type="password"
                                        id="inputSenha"
                                        className="form-control"
                                        name="senha"
                                        onChange={e => this.setState({senha: e.target.value})} />
                            </FormGroup>
                            <br/>
                            <FormGroup label= "Repita a Senha:*" htmlFor="inputRepitaSenha">
                                <input  type="password"
                                        id="inputSenhaRep"
                                        className="form-control"
                                        name="senha"
                                        onChange={e => this.setState({senhaRepeticao: e.target.value})} />
                            </FormGroup>
                            <br/>
                            <button onClick={this.cadastrar} type="button" className='btn btn-success'>
                                <i className="pi pi-save"></i> Salvar
                            </button>
                            <Link to="/login"><button type='button' className='btn btn-danger'>
                                <i className="pi pi-times"></i> Cancelar
                            </button></Link>
                        </div>
                    </div>
                </div>
            </Card>           
        )
    }
}

export default CadastroUsuario