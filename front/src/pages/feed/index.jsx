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
                    <img src='/assets/images/search.svg'/>

                    <input type='text' placeholder='Pesquise'/>
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

            <main className="conteudo-feed">
                <h1>Bem-vindo ao Bairro+!</h1>
                <p>Conecte-se com sua comunidade.</p>

                <section id="publicacoes">
                    <h2>Publicações do bairro</h2>
                    <p>Em breve, você poderá acompanhar as novidades da sua região.</p>
                </section>
            </main>

        </div>
    );
}