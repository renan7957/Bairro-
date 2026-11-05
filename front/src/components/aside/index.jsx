import './index.scss';

export default function Aside() {
    return (
        <aside className="aside">

            <nav className="menu-lateral">

                <a href="/feed" className="ativo">
                    <span>⌂</span>
                    Início
                </a>

                <a href="/mapa">
                    <span>📍</span>
                    Mapa
                </a>

                <a href="/comunidade">
                    <span>♧</span>
                    Comunidade
                </a>

                <a href="/salvos">
                    <span>♡</span>
                    Salvos
                </a>

                <a href="/configuracoes">
                    <span>⚙</span>
                    Configurações
                </a>

            </nav>

            <div className="card-aside">
                <span className="icone-grupo">👥</span>

                <h2>
                    Juntos fazemos
                    um bairro
                    melhor!
                </h2>

                <div className="imagem-bairro"
                    style={{ background: "url('/assets/images/fundo2.png') center / cover no-repeat" }}>

                    <img src="/assets/images/casinha.png" alt="Imagem do bairro" />
                </div>
            </div>

        </aside>
    );
}