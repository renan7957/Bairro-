
import { useState } from 'react';
import './index.scss';

const API_URL = 'http://localhost:5050';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function entrar(event) {
        event.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const resposta = await fetch(`${API_URL}/conta/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Erro ao entrar.');
            }

            localStorage.setItem('token', dados.token);

            window.location.href = '/feed';
        } catch (error) {
            setErro(error.message || 'Não foi possível conectar à API.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="pagina-login">
            <section className="login-section">
                <div className="login-image">
                    <img
                        src="/assets/images/casinha.png"
                        alt="Ilustração do Bairro+"
                    />
                </div>

                <div className="login-card">
                    <form className="login-form" onSubmit={entrar}>
                        <img
                            className="logo"
                            src="/assets/images/logo.png"
                            alt="Logo Bairro+"
                        />

                        <h1>Bem-vindo(a)!</h1>

                        <p className="p1">
                            Acesse sua conta para continuar
                            conectado no seu bairro.
                        </p>

                        <div className="input-nome">
                            <img
                                className="icon"
                                src="/assets/images/user.svg"
                                alt=""
                            />

                            <input
                                type="email"
                                placeholder="Seu e-mail"
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

                        <div className="checkbox-container">
                            <label className="checkbox">
                                <input type="checkbox" id="remember-me" />
                                <span>Lembrar de mim</span>
                            </label>

                            <a href="/recuperar-senha">
                                Esqueci minha senha
                            </a>
                        </div>

                        {erro && <p role="alert">{erro}</p>}

                        <div className="login-buttons">
                            <button
                                type="submit"
                                className="login-button"
                                disabled={carregando}
                            >
                                <span>
                                    {carregando ? 'Entrando...' : 'Entrar'}
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
                            <p>Não tem uma conta?</p>
                            <span></span>
                        </div>

                        <a href="/cadastro" className="criar-conta">
                            Criar conta
                        </a>
                    </form>
                </div>
            </section>
        </div>
    );
}
