import React from "react";
import ApiService from "../apiservice";
import ErroValidacao from "../exception/ErroValidacao";

export default class LancamentoService extends ApiService{

    constructor(){
        super('/lancamentos')
    }

    obterListaMeses(){
        return(
            [
                { label: 'Selecione', valor: '' },
                { label: 'Janeiro', valor: 1 },
                { label: 'Fevereiro', valor: 2 },
                { label: 'Março', valor: 3 },
                { label: 'Abril', valor: 4 },
                { label: 'Maio', valor: 5 },
                { label: 'Junho', valor: 6 },
                { label: 'Julho', valor: 7 },
                { label: 'Agosto', valor: 8 },
                { label: 'Setembro', valor: 9 },
                { label: 'Outubro', valor: 10 },
                { label: 'Novembro', valor: 11 },
                { label: 'Dezembro', valor: 12 }
            ]
        )
    }

    obterListaTipos(){
        return(
            [
                { label: 'Selecione', valor: ''},
                { label: 'Receita', valor: 'RECEITA' },
                { label: 'Despesa', valor: 'DESPESA' }
            ]  
        )
    }

    buscarPorId(id){
        return (
            this.get(`/${id}`)
        )
    }

    alterarStatus(id, status){
        return this.put(`/atualiza-status/${id}`, {status})
    }

    validar(lancamento){
        const erros =[]

        if(!lancamento.ano){
            erros.push("Informe o Ano.")
        }
        if(!lancamento.mes){
            erros.push("Informe o Mês")
        }
        if(!lancamento.descricao){
            erros.push("Informe a Descrição")
        }
        if(!lancamento.valor){
            erros.push("Informe o Valor")
        }
        if(!lancamento.tipo){
            erros.push("Informe o Tipo")
        }
        if(erros.length > 0){
            throw new ErroValidacao(erros);
        }
    }

    salvar(lancamento){
        return this.post('/', lancamento)
    }

    atualizar(lancamento){
        return this.put(`/${lancamento.id}`, lancamento)
    }

    consultar(lancamentoFiltro){
        let params = `?ano=${lancamentoFiltro.ano}`

        if(lancamentoFiltro.mes){
            params = `${params}&mes=${lancamentoFiltro.mes}`
        }

        if(lancamentoFiltro.tipo){
            params = `${params}&tipo=${lancamentoFiltro.tipo}`
        }

        if(lancamentoFiltro.status){
            params = `${params}&status=${lancamentoFiltro.status}`
        }

        if(lancamentoFiltro.usuario){
            params = `${params}&usuario=${lancamentoFiltro.usuario}`
        }

        if(lancamentoFiltro.descricao){
            params = `${params}&descricao=${lancamentoFiltro.descricao}`
        }

        return this.get(params)
    }

    deletar(id){
        return(
            this.delete(`/${id}`)
        )
    }

}

