import React from "react";
import {Link, Navigate} from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from "../../components/form-group";
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from "./lancamentosTable";

import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localstorageService'

import * as messages from '../../components/toastr'

import {Dialog} from 'primereact/dialog'
import { Button } from 'primereact/button';


class ConsultaLancamentos extends React.Component{
    state ={
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: [], 
        redirect: {on: false, path: ''}    
    }

    constructor(){
        super()
        this.service = new LancamentoService();
    }

    buscar = () => {
        if(!this.state.ano){
            messages.mensagemErro('O preenchimento do campo ano é obrigatório.')
            return false
        }
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        let lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service.consultar(lancamentoFiltro)
        .then( resposta => {
            const lista = resposta.data

            if(lista.length < 1){
                messages.mensagemAlert("Nenhum resultado encontrado.")
            }
            
            this.setState({lancamentos: lista})
        }).catch( error => {
            console.log(error)
        })
    }

    editar = (id) => {
        console.log(id)
        this.redirect({path: `/cadastro-lancamentos/${id}`})
    }

    cancelarDelecao = () =>{
        this.setState({showConfirmDialog: false, lancamentoDeletar: {}})
    }

    deletar = () => {
        this.service.deletar(this.state.lancamentoDeletar.id)
        .then( response => {
            const index = this.state.lancamentos.indexOf(this.state.lancamentoDeletar)
            this.state.lancamentos.splice(index, 1);
            this.setState({lancamentos: this.state.lancamentos, showConfirmDialog: false});
            messages.mensagemSucesso("Lançamento deletado com sucesso.");
        }).catch(error => {
            messages.mensagemErro("Ocorreu um erro ao tentar deletar um lançamento.")
        })
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({showConfirmDialog: true, lancamentoDeletar: lancamento})
    }

    redirect = ({path}) => {
        this.setState({redirect: {on: true, path: path}})
        console.log('The path: ',this.state.redirect.path)
    }

    alterarStatus = (lancamento, status) => {
        this.service.alterarStatus(lancamento.id, status)
        .then(response => {
            const lancamentos = this.state.lancamentos;
            const index = lancamentos.indexOf(lancamento)
            if(index !== -1){
                lancamento['status'] = status
                lancamentos[index] = lancamento
                this.setState({lancamentos})
            }
            messages.mensagemSucesso("Status atualizado com sucesso!")
        })
    }

    render(){
        const confirmDialogFooter = (        
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        )

        const meses = this.service.obterListaMeses();

        const tipos = this.service.obterListaTipos();

        if(this.state.redirect.on){
            
            return (<Navigate to={this.state.redirect.path} replace={true}/>)
        }

        return(
            <div>
                <Card title="Consulta Lançamentos">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="bs-component">
                                <FormGroup htmlFor="inputAno" label="Ano: *">
                                    <input  type="text" 
                                            className="form-control" 
                                            id="inputAno"
                                            value={this.state.ano}
                                            onChange={e => this.setState({ano: e.target.value})}
                                            placeholder="Digite o Ano."/>
                                </FormGroup>
                                <br/>
                                <FormGroup htmlFor="inputMes" label="Mês: *">
                                    <SelectMenu id="inpuMes" 
                                                value={this.state.mes}
                                                onChange={e => this.setState({mes: e.target.value})}
                                                className="form-control" 
                                                lista={meses}/>
                                </FormGroup>
                                <br/>
                                <FormGroup htmlFor="inputDesc" label="Descrição: *">
                                    <input  type="text" 
                                            className="form-control" 
                                            id="inputDesc"
                                            value={this.state.descricao}
                                            onChange={e => this.setState({descricao: e.target.value})}
                                            placeholder="Digite a descrição."/>
                                </FormGroup>
                                <br/>
                                <FormGroup htmlFor="inputTipo" label="Tipo Lançamento: *">
                                    <SelectMenu id="inputTipo" 
                                                value={this.state.tipo}
                                                onChange={e => this.setState({tipo: e.target.value})}
                                                className="form-control" 
                                                lista={tipos} />
                                </FormGroup>
                                <br/>
                                <button onClick={this.buscar} 
                                        type="button" 
                                        className="btn btn-success">
                                        <i className="pi pi-search"></i> Buscar
                                </button>
                                <button onClick={(e) => {this.redirect({path: '/cadastro-lancamentos'})}} 
                                        type="button"
                                        className="btn btn-danger">
                                        <i className="pi pi-plus"></i> Cadastrar
                                </button>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="bs-component">
                                <LancamentosTable lancamentos={this.state.lancamentos} 
                                                    editAction={this.editar}
                                                    deleteAction={this.abrirConfirmacao}
                                                    alterarStatus={this.alterarStatus}/>
                            </div>
                        </div> 
                    </div>
                    <div>
                        <Dialog header="Confirmação" 
                                footer={confirmDialogFooter}
                                visible={this.state.showConfirmDialog} 
                                style={{ width: '50vw'}} 
                                modal={true} 
                                onHide={() => this.setState({showConfirmDialog: false})}>
                            Confirma a exclusão deste lançamento ?
                        </Dialog>
                    </div>
                </Card>  
            </div>
        )
    }
}

export default ConsultaLancamentos