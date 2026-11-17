
import './index.scss';
import { useNavigate } from 'react-router-dom';

function Icon({ name, size = 18 }) {
    const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true
    };

    switch (name) {
        case 'search':
            return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
        case 'bell':
            return <svg {...common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>;
        case 'logout':
            return <svg {...common}><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>;
        case 'home':
            return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></svg>;
        case 'people':
            return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5" /></svg>;
        case 'map':
            return <svg {...common}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></svg>;
        case 'user':
            return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.8 3.1-6 7-6s7 2.2 7 6" /></svg>;
        default:
            return null;
    }
}

const comunidades = [
    {
        id: 'grajau',
        nome: 'grajau',
        imagem: '/assets/images/grajau.jpg',
        descricao: 'Fique por dentro do que acontece no seu bairro, compartilhe informações e conecte-se com os moradores.',
        pessoas: '120.000',
        bairros: 'Grajaú e região'
    },
    {
        id: 'varginha',
        nome: 'varginha',
        imagem: '/assets/images/varginha.jpg',
        descricao: 'Fique por dentro do que acontece no Varginha, compartilhe informações importantes e acompanhe os avisos da região.',
        pessoas: '40.000',
        bairros: 'Varginha e região'
    },
    {
        id: 'vila-sao-jose',
        nome: 'vila são jose',
        imagem: '/assets/images/vila-sao-jose.jpg',
        descricao: 'Fique por dentro do que acontece no seu bairro, compartilhe informações e conecte-se com os moradores.',
        pessoas: '120.000',
        bairros: 'Vila São José e região'
    },
    {
        id: 'interlagos',
        nome: 'interlagos',
        imagem: '/assets/images/interlagos.jpg',
        descricao: 'Acompanhe as novidades de Interlagos, fique atento aos comunicados da região e compartilhe acontecimentos do dia a dia.',
        pessoas: '36.804',
        bairros: 'Interlagos e região'
    }
];

export default function Comunidade() {
    const navegar = useNavigate();

    function sair() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    function entrarNaComunidade(id) {
        navegar(`/comunidade/${id}`);
    }

    return (
        <div className="comunidade">

            <header className="feed-topbar">
                <a href="/feed" className="feed-logo" aria-label="Bairro+, início">
                    <img
                        className="feed-logo-image"
                        src="/assets/images/logo3.png"
                        alt="Bairro+"
                    />
                </a>

                <label className="feed-search">
                    <Icon name="search" size={18} />
                    <input type="search" placeholder="Pesquisar no bairro..." />
                </label>

                <div className="feed-header-actions">
                    <button className="header-icon-button" type="button" aria-label="Notificações">
                        <Icon name="bell" size={22} />
                    </button>

                    <button
                        className="header-icon-button"
                        type="button"
                        onClick={sair}
                        aria-label="Sair"
                        title="Sair"
                    >
                        <Icon name="logout" size={22} />
                    </button>
                </div>
            </header>

            <main className="comunidade-conteudo">
                <h1>procure sua comunidade</h1>

                <section className="comunidade-lista">
                    {comunidades.map((comunidade) => (
                        <article className="comunidade-card" key={comunidade.id}>
                            <img
                                className="comunidade-imagem"
                                src={comunidade.imagem}
                                alt={`Comunidade ${comunidade.nome}`}
                            />

                            <div className="comunidade-informacoes">
                                <h2>{comunidade.nome}</h2>

                                <p>{comunidade.descricao}</p>

                                <div className="comunidade-dados">
                                    <span>
                                        <Icon name="people" size={15} />
                                        pessoas na comunidade: {comunidade.pessoas}
                                    </span>

                                    <span>
                                        <Icon name="home" size={15} />
                                        bairros incluídos: {comunidade.bairros}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => entrarNaComunidade(comunidade.id)}
                                >
                                    entrar na comunidade
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>

            <nav className="feed-bottom-nav" aria-label="Navegação principal">
                <a className="bottom-nav-item" href="/feed">
                    <Icon name="home" size={19} />
                    <span>Início</span>
                </a>

                <a className="bottom-nav-item is-current" href="/comunidade" aria-current="page">
                    <Icon name="people" size={19} />
                    <span>Comunidade</span>
                </a>

                <a className="bottom-nav-item" href="/mapa">
                    <Icon name="map" size={19} />
                    <span>Mapa</span>
                </a>

                <a className="bottom-nav-item" href="/conta">
                    <Icon name="user" size={19} />
                    <span>Conta</span>
                </a>
            </nav>
        </div>
    );
}
