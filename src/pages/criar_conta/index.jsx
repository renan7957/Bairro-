import './index.scss'

export default function CriarConta (){
    return(

        <div className='pag-criarconta'>
            <section className='criar-conta'>

                {/* Cartão de login */}
                <div className="login-card">
                    <div className="login-form">

                        {/* Título */}
                        <h1>Criar conta</h1>

                        <p className="p1">
                            É rápido e fácil. Preencha os dados abaixo para se juntar à nossa comunidade.
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



                        {/* Campo de telefone*/}
                        <div className='input-telefone'>
                            
                            <img
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
                                src='/assets/images/map-pinned.svg'
                                alt='mapa'
                            />
                            
                            <input
                                type='text'
                                placeholder='Telefone'
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
                            className="criar-conta"
                        >
                            Fazer login
                        </a>

                    </div>
                </div>


            </section>
        </div>
    )
}