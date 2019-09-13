import React, { Component } from 'react';
import $ from 'jquery';
import InputField from './components/InputField';
import SubmitForm from './components/SubmitForm';
import PubSub from 'pubsub-js';

class FormAutor extends Component {
    constructor(){
        super();
        this.state = {nome:'', email:'', senha:''}; 
    }

    enviaFormulario(evento){
        evento.preventDefault();

        $.ajax({
            url:"http://localhost:8080/api/autores",
            dataType: "json",
            contentType: "application/json",
            type: "post",
            data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
            success: novaListagem => {
                PubSub.publish('atualiza-lista-autores', novaListagem);
                this.setState({nome:'',email:'',senha:''})
            },
            error: resposta => console.log(resposta)
        });    
    }
      
      setNome(evento){
        this.setState({nome: evento.target.value});
      }
      setEmail(evento){
        this.setState({email: evento.target.value});
      }
      setSenha(evento){
        this.setState({senha: evento.target.value});
      }

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaFormulario.bind(this)} method="POST">
                <InputField label="Nome" id="nome" type="text" value={this.state.nome} onChange={this.setNome.bind(this)} />
                <InputField label="Email" id="email" type="email" value={this.state.email} onChange={this.setEmail.bind(this)} />
                <InputField label="Senha" id="senha" type="password" value={this.state.senha} onChange={this.setSenha.bind(this)} />
                <SubmitForm type="submit" className="pure-button pure-button-primary" buttonText="Gravar" />
                </form>
            </div>
        );
    }
}

class TabelaAutor extends Component {

    render(){
        return(
            <div>
                <table className="pure-table">
                <thead>
                    <tr>
                    <th>Nome</th>
                    <th>email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    this.props.lista.map(function(autor){
                        return (
                        <tr key={autor.id}>
                            <td>{autor.nome}</td>
                            <td>{autor.email}</td>
                        </tr>
                        )                  
                    })
                    }
                </tbody>
                </table>
            </div>
        );
    }
}

export default class AutorBox extends Component {
    constructor(){
        super();
        this.state = {lista:[]};
    }

    componentDidMount(){
        $.ajax({
            url:"http://localhost:8080/api/autores",
            dataType: 'JSON',
            success: resposta => this.setState({lista: resposta})
        });

        PubSub.subscribe('atualiza-lista-autores', (topico, novaLista) => {
            this.setState({lista:novaLista});
        });
    }

    render(){
        return(
            <div>
                <FormAutor atualizaLista={this.atualizaLista} />
                <TabelaAutor lista={this.state.lista} />
            </div>
        );
    }
}