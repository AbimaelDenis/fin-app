import React from 'react'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import {Navigate, Link, useParams} from 'react-router-dom'
import SelectMenu from '../../components/selectMenu'

import LancamentoService from '../../app/service/lancamentoService'
import * as messages from '../../components/toastr'
import LocalStorageService from '../../app/service/localstorageService'
import withRouter from '../../app/service/hocService'


class CadastroLancamentos extends React.Component {
    
    state = {
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null,
        redirect: false,
        atualizando: false
    }

    constructor(){
        super()
        this.service = new LancamentoService();
    }

    componentDidMount(){
        this.service.buscarPorId(this.props.params.id)
        .then(response =>{
            this.setState({...response.data, atualizando: true})
            this.setState({mes: this.obterIntMes(response.data.mes, false)})
        }).catch(error => {
            console.log(error.response.data)
        })
    }

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem("_usuario_logado");

        const {descricao, valor, mes, ano, tipo } = this.state
       
        const lancamento = {descricao, valor, mes: this.obterIntMes(mes, true), ano, tipo: tipo.toUpperCase(), usuario: usuarioLogado.id, status: 'PENDENTE'}
        
        try{
            this.service.validar(lancamento)
        }catch(erro){
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => {
                messages.mensagemErro(msg)
            })
            return false
        }

        this.service.salvar(lancamento)
        .then(response => {
            this.setState({redirect: true})
            messages.mensagemSucesso('Lançamento cadastrado com sucesso!')
        }).catch(error => {
            messages.mensagemErro(error.response.data)
        })
    }   

    atualizar = ()=> {
        const {descricao, valor, mes, ano, tipo, id, usuario } = this.state
       
        const lancamento = {descricao, valor, mes: this.obterIntMes(mes, true), ano, tipo: tipo.toUpperCase(), id, usuario, status: 'PENDENTE'}
        this.service.atualizar(lancamento)
        .then(response => {
            this.setState({redirect: true})
            messages.mensagemSucesso('Lançamento atualizado com sucesso!')
        }).catch(error => {
            messages.mensagemErro(error.response.data)
        })
    }

    handleChange = (event) => {
        const value = event.target.value; //valor do campo
        const name = event.target.name; //prpriedade 'name' do input  
        
        this.setState({[name]: value}) // o '[name]' é uma variavel de nome dinamico seu nome muda de acordo com a propriedade 'name' de cada input que chama a função
        
    }

    redirect = () => {
        this.setState({redirect: true})
    }

    obterIntMes(mes, valor){
        var meses = this.service.obterListaMeses();
        var id = ''
        if(valor){
            meses.forEach(m => {
                if(m.label == mes){
                    id = m.valor.toString()
                }
            })       
        }else{
            meses.forEach(m => {
                if(m.valor == mes){
                    id = m.label
                }
            })           
        }
        return id
    }

    render(){
        
        const tipos = this.service.obterListaTipos();
        const meses = this.service.obterListaMeses();

        if(this.state.redirect){
            return (<Navigate to="/consulta-lancamentos" redirect={true}/>)
        }

        return(
            <Card title={this.state.atualizando ? 'Atualização de Lançamento': 'Cadastro de Laçamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição: *">
                            <input id="inputDescricao" type="text" 
                                    className="form-control"
                                    name="descricao"
                                    value={this.state.descricao}
                                    onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno" 
                                    type="text" 
                                    name="ano"
                                    value={this.state.ano}
                                    onChange={this.handleChange}
                                    className="form-control"/>
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" 
                                        value={this.state.mes}
                                        onChange={this.handleChange}
                                        lista={meses} 
                                        name="mes"
                                        className="form-control"/>
                        </FormGroup>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inpuValor" label="Valor: *">
                            <input id="inputValor" 
                                    type="text" 
                                    name="valor"
                                    value={this.state.valor}
                                    onChange={this.handleChange}
                                    className="form-control"/>
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inpuTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" 
                                        lista={tipos} 
                                        name="tipo"
                                        value={this.state.tipo}
                                        onChange={this.handleChange}
                                        className="form-control"/>
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inpuStatus" label="Status: *">
                            <input type="text" 
                                    className="form-control" 
                                    name="status"
                                    value={this.state.status}
                                    disabled/>
                        </FormGroup>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-6">
                            <br/>
                            {this.state.atualizando ? (<button onClick={this.atualizar} 
                                                                className="btn btn-primary">
                                                                <i className="pi pi-refresh"></i> Atualizar
                                                        </button>)
                                                     : (<button onClick={this.submit} 
                                                                className="btn btn-success">
                                                                <i className="pi pi-save"></i> Salvar
                                                        </button>)
                            }
                            <button onClick={this.redirect} 
                                    className="btn btn-danger">
                                    <i className="pi pi-times"></i> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos)
