import './index.scss';

export default function Cabecalho({ onSair }) {
    return (
        <header className="cabecalho">

            <a href="/feed" className="logo">
                <img
                    src="/assets/images/logo3.png"
                    alt="Bairro+ — Juntos por um bairro mais conectado"
                />
            </a>

            <div className="pesquisa">
                <img src="/assets/images/search.svg" alt="" />
                <input type="text" placeholder="Pesquise" />
            </div>

            <nav className="menu">
                <a href="/inicio">Início</a>
                <a href="#publicacoes">Publicações</a>
                <a href="#contato">Contato</a>

                <button
                    className="botao-sair"
                    onClick={onSair}
                >
                    Sair
                </button>
            </nav>

        </header>
    );
}