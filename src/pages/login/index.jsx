
import './index.scss';

export default function Login() {
    return (
        <div className="pagina-login">
            <section className="login-section">

                {/* Imagem do bairro */}
                <div className="login-image">
                    <img
                        src="/assets/images/casinha.png"
                        alt="Ilustração do Bairro+"
                    />
                </div>

                {/* Cartão de login */}
                <div className="login-card">
                    <div className="login-form">

                        {/* Logo */}
                        <img
                            className="logo"
                            src="/assets/images/logo.png"
                            alt="Logo Bairro+"
                        />

                        {/* Título */}
                        <h1>Bem-vindo(a)!</h1>

                        <p className="p1">
                            Acesse sua conta para continuar
                            conectado no seu bairro.
                        </p>

                        {/* Campo de usuário */}
                        <div className="input-nome">
                            <img
                                className="icon"
                                src="/assets/images/user.svg"
                                alt=""
                            />

                            <input
                                type="text"
                                placeholder="Usuário ou E-mail"
                            />
                        </div>

                        {/* Campo de senha */}
                        <div className="input-senha">
                            <img
                                className="icon"
                                src="/assets/images/lock.svg"
                                alt=""
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                            />
                        </div>

                        {/* Lembrar e recuperar senha */}
                        <div className="checkbox-container">

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                />
                                <span>Lembrar de mim</span>
                            </label>

                            <a href="/recuperar-senha">
                                Esqueci minha senha
                            </a>

                        </div>

                        {/* Botão entrar */}
                        <div className="login-buttons">
                            <button
                                type="button"
                                className="login-button"
                            >
                                <span>Entrar</span>

                                <img
                                    src="/assets/images/arrow-right.svg"
                                    alt=""
                                    className="arrow-icon"
                                />
                            </button>
                        </div>

                        {/* Divisor */}
                        <div className="divisor">
                            <span></span>

                            <p>Não tem uma conta?</p>

                            <span></span>
                        </div>

                        {/* Criar conta */}
                        <a
                            href="/cadastro"
                            className="criar-conta"
                        >
                            Criar conta
                        </a>

                    </div>
                </div>

            </section>
        </div>
    );
}

