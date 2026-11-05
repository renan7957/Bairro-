import './index.scss';



export default function Feed() {
    function sair() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <div className="pag-feed">

            <header className="cabecalho">
                <a href="/inicio" className="logo">
                    <img
                        src="/assets/images/logo3.png"
                        alt="Bairro+ — Juntos por um bairro mais conectado!"
                    />
                </a>

                <div className='pesquisa'>
                    <img src='/assets/images/search.svg' />

                    <input type='text' placeholder='Pesquise' />
                </div>

                <nav className="menu">
                    <a href="/inicio">Início</a>
                    <a href="#publicacoes">Publicações</a>
                    <a href="#contato">Contato</a>

                    <button
                        className="botao-sair"
                        onClick={sair}
                    >
                        Sair
                    </button>
                </nav>
            </header>






            <div className="layout-feed">

                <aside className="aside"
                    style={{ background: "url('/assets/images/fundo2.png') center / cover no-repeat" }}>

                    <nav className="menu-lateral">

                        <a href="/feed" className="ativo">
                            <img src="/assets/images/house (4).svg" alt="" />
                            Início
                        </a>

                        <a href="/mapa">
                            <img src="/assets/images/mapa3.svg" alt="" />
                            Mapa
                        </a>

                        <a href="/comunidade">
                            <img src="/assets/images/users2.svg" alt="" />
                            Comunidade
                        </a>

                        <a href="/configuracoes">
                            <img src="/assets/images/settings.svg" alt="" />
                            Configurações
                        </a>

                    </nav>

                    <div className="card-aside">
                        <span className="icone-grupo"><img src="/assets/images/grupo.png" alt="" /></span>

                        <h2>
                            Juntos fazemos
                            um bairro <br></br>
                            melhor!
                        </h2>

                        <div className="imagem-bairro">
                            <img src="/assets/images/casinha2.png" alt="" />
                        </div>
                    </div>

                </aside>

                <main className="conteudo-feed">
                    <h1>Bem-vindo ao Bairro+!</h1>
                    <p>Conecte-se com sua comunidade.</p>

                    <section id="publicacoes">
                        <h2>Publicações do bairro</h2>
                        <p>Em breve, você poderá acompanhar as novidades da sua região.</p>
                    </section>
                </main>


            </div>
        </div>
    );
}