import ApiService from "../apiservice";
import ErroValidacao from "../exception/ErroValidacao";

class UsuarioService extends ApiService{

    constructor(){
        super('/usuarios')
    }

    autenticar(credenciais){
        return this.post('/autenticar', credenciais)
    }

    obterSaldoPorUsuario(id){
        return this.get(`/${id}/saldo`)
    }

    salvar(usuario){
        return this.post('/', usuario)
    }

    validar(usuario){
        const erros = []

        if(!usuario.nome){
            erros.push("O campo Nome é obrigatório.")
        }

        if(!usuario.email){
            erros.push("O campo Email é obrigatório.")
        }else if(!usuario.email.match(/^[A-Za-z0-1-._]+@[A-Za-z0-1]+\.[a-z]{3}(\.[a-z]{2})?/)){
            erros.push("Digite um email válido.")
        }

        if(!usuario.senha || !usuario.senhaRepeticao){
            erros.push("Digite a senha 2x.")
        }else if(usuario.senha !== usuario.senhaRepeticao){
            erros.push("As senhas não batem.")
        }

        if(erros.length > 0){
            throw new ErroValidacao(erros)
        }
    }
}

export default UsuarioService