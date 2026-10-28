
import { useState } from 'react';
import './index.scss';

export default function CriarConta() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [telefone, setTelefone] = useState('');
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);

   
async function cadastrar(event) {
    event.preventDefault();
    setErro('');
    setMensagem('');

    if (senha !== confirmar) {
        setErro('As senhas não são iguais.');
        return;
    }

    setCarregando(true);

    try {
        const resposta = await fetch('http://localhost:5050/conta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                email,
                telefone,
                senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Não foi possível criar a conta.');
        }

        if (dados.token) {
            localStorage.setItem('token', dados.token);
        }

        setMensagem('Conta criada com sucesso!');

        setTimeout(() => {
            window.location.href = '/feed';
        }, 1000);

    } catch (error) {
        setErro(error.message || 'Não foi possível conectar à API.');
    } finally {
        setCarregando(false);
    }
}

return (
    <div className="pagina-cadastro">
        <a href="/login" className="Voltar">
            <img
                src="/assets/images/arrow-left.png"
                className="arrow-icon-voltar"
                alt="Voltar"
            />
        </a>

        <section className="cadastro">
            <div className="cadastro-image">
                <div className="descricao">
                    <img
                        className="logo"
                        src="/assets/images/logo.png"
                        alt="Logo Bairro+"
                    />

                    <h1>
                        Juntos por um bairro <br />
                        <span className="titulo2">mais conectado!</span>
                    </h1>

                    <p className="p1">
                        Crie sua conta e faça parte de uma <br />
                        comunidade que compartilha, ajuda <br />
                        e melhora o nosso bairro.
                    </p>
                </div>

                <img
                    src="/assets/images/casinha.png"
                    alt="Ilustração do Bairro+"
                />
            </div>

            <div className="cadastro-card">
                <form className="cadastro-form" onSubmit={cadastrar}>
                    <h1>Criar conta</h1>

                    <p className="p1">
                        É rápido e fácil. Preencha os dados abaixo para se juntar à nossa comunidade.
                    </p>

                    <div className="Campos-cadastro">
                        <div className="input-nome">
                            <img
                                className="icon"
                                src="/assets/images/user.svg"
                                alt=""
                            />
                            <input
                                type="text"
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-email">
                            <img
                                className="icon"
                                src="/assets/images/mail.svg"
                                alt=""
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-senha">
                            <img
                                className="icon"
                                src="/assets/images/lock.svg"
                                alt=""
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-senha">
                            <img
                                className="icon"
                                src="/assets/images/lock.svg"
                                alt=""
                            />
                            <input
                                type="password"
                                placeholder="Confirmar senha"
                                value={confirmar}
                                onChange={(e) => setConfirmar(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-telefone">
                        <img
                            className="icon"
                            src="/assets/images/phone.svg"
                            alt=""
                        />
                        <input
                            type="tel"
                            placeholder="Telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                        />
                    </div>

                    {erro && <p role="alert">{erro}</p>}
                    {mensagem && <p role="status">{mensagem}</p>}

                    <div className="criar-buttons">
                        <button
                            type="submit"
                            className="criar-button"
                            disabled={carregando}
                        >
                            <span>
                                {carregando ? 'Criando...' : 'Criar Conta'}
                            </span>

                            <img
                                src="/assets/images/arrow-right.svg"
                                alt=""
                                className="arrow-icon"
                            />
                        </button>
                    </div>

                    <div className="divisor">
                        <span></span>
                        <p>Já tem uma conta?</p>
                        <span></span>
                    </div>

                    <a href="/login" className="logar-conta">
                        Fazer login
                    </a>
                </form>
            </div>
        </section>
    </div>
);
}
