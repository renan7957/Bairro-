import './index.scss'

export default function CriarConta() {
    return (

        <div className='pagina-cadastro'>
            <section className='cadastro'>



                <div className="cadastro-image">
                    {/* Logo */}

                    <div className='descricao'>
                    <img
                        className="logo"
                        src="/assets/images/logo.png"
                        alt="Logo Bairro+"
                    />

                    <h1>Juntos por um bairro <br></br>
                        <span className='titulo2'>mais conectado!</span></h1>

                    <p className='p1'>
                        Crie sua conta e faça parte de uma <br></br> comunidade que compartilha, ajuda <br></br>e melhora o nosso bairro.
                    </p>
                    </div>

                    {/* Imagem do bairro */}
                    <img
                        src="/assets/images/casinha.png"
                        alt="Ilustração do Bairro+"
                    />


                </div>

                {/* Cartão de login */}
                <div className="cadastro-card">
                    <div className="cadastro-form">

                        {/* Título */}
                        <h1>Criar conta</h1>

                        <p className="p1">
                            É rápido e fácil. Preencha os dados abaixo para se juntar à nossa comunidade.
                        </p>


                        <div className='Campos-cadastro'>
                            {/* Campo de usuário */}
                            <div className="input-nome">
                                <img
                                    className="icon"
                                    src="/assets/images/user.svg"
                                    alt=""
                                />

                                <input
                                    type="text"
                                    placeholder="Nome de usuario"
                                />
                            </div>

                            {/* Campo de email*/}
                            <div className='input-email'>

                                <img
                                    className='icon'
                                    src='/assets/images/mail.svg'
                                />


                                <input
                                    type='text'
                                    placeholder='Email'
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


                            {/* Campo de confirmar senha */}
                            <div className="input-senha">
                                <img
                                    className="icon"
                                    src="/assets/images/lock.svg"
                                    alt=""
                                />

                                <input
                                    type="password"
                                    placeholder="Confirmar senha"
                                />
                            </div>

                        </div>

                        {/* Campo de telefone*/}
                        <div className='input-telefone'>

                            <img
                                className='icon'
                                src='/assets/images/phone.svg'
                                alt='telefone'
                            />

                            <input
                                type='text'
                                placeholder='Telefone'
                            />
                        </div>




                        {/* Campo-bairro */}
                        <div className='input-bairro'>

                            <img
                                className='icon'
                                src='/assets/images/map-pinned.svg'
                                alt='mapa'
                            />

                            <input
                                type='text'
                                placeholder='Selecione o bairro'
                            />
                        </div>


                        {/* Botão entrar */}
                        <div className="criar-buttons">
                            <button
                                type="button"
                                className="criar-button"
                            >
                                <span>Criar Conta</span>

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

                            <p>Já tem uma conta?</p>

                            <span></span>
                        </div>

                        {/* Criar conta */}
                        <a
                            href="/cadastro"
                            className="logar-conta"
                        >
                            Fazer login
                        </a>

                    </div>
                </div>


            </section>
        </div>
    )
}