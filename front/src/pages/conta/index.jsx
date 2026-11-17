
import './index.scss';
import '../feed/index.scss';
import { useEffect, useState } from 'react';

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

function urlDaImagem(foto) {
    if (!foto) return '';
    return foto.startsWith('/uploads/')
        ? `http://localhost:5050${foto}`
        : foto;
}

export default function Conta() {
    const [conta, setConta] = useState(null);
    const [postagens, setPostagens] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const totalCurtidas = postagens.reduce(
        (total, postagem) => total + Number(postagem.total_curtidas || 0),
        0
    );

    const totalCompartilhamentos = postagens.reduce(
        (total, postagem) => total + Number(postagem.total_compartilhamentos || 0),
        0
    );

    function sair() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    async function buscarDados() {
        const token = localStorage.getItem('token');

        try {
            const [respostaConta, respostaPostagens] = await Promise.all([
                fetch('http://localhost:5050/conta', {
                    headers: { 'x-access-token': token }
                }),
                fetch('http://localhost:5050/postagem', {
                    headers: { 'x-access-token': token }
                })
            ]);

            const dadosConta = await respostaConta.json();
            const dadosPostagens = await respostaPostagens.json();

            if (!respostaConta.ok) {
                throw new Error(dadosConta.erro || 'Não foi possível carregar sua conta.');
            }

            if (!respostaPostagens.ok) {
                throw new Error(dadosPostagens.erro || 'Não foi possível carregar suas publicações.');
            }

            setConta(dadosConta);

            const minhasPostagens = dadosPostagens.filter(
                postagem => Number(postagem.minha) === 1 || postagem.minha === true
            );

            setPostagens(minhasPostagens);
            setErro('');

        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarDados();
    }, []);

    return (
        <div className="pag-feed pagina-conta">

            <header className="feed-topbar">
                <a href="/feed" className="feed-logo" aria-label="Bairro+, início">
                    <img
                        className="feed-logo-image"
                        src="/assets/images/logo3.png"
                        alt="Bairro+ — Juntos por um bairro mais conectado"
                    />
                </a>

                <label className="feed-search">
                    <Icon name="search" size={18} />
                    <input type="search" placeholder="Pesquisar no bairro..." />
                </label>

                <div className="feed-header-actions">
                    <button
                        className="header-icon-button"
                        type="button"
                        aria-label="Notificações"
                    >
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

            <main className="feed-main conta-main">
                <div className="conta-conteudo">

                    {carregando && (
                        <p>Carregando sua conta...</p>
                    )}

                    {erro && (
                        <p className="conta-erro">{erro}</p>
                    )}

                    {!carregando && !erro && conta && (
                        <>
                            <section className="perfil-conta">
                                <div className="perfil-foto">
                                    <span>
                                        {conta.nome.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <div className="perfil-informacoes">
                                    <h2>{conta.nome}</h2>
                                    <p>Morador(a) do Bairro+</p>
                                </div>
                            </section>

                            <section className="conta-estatisticas">
                                <div className="estatistica">
                                    <strong>{postagens.length}</strong>
                                    <span>Publicações</span>
                                </div>

                                <div className="estatistica">
                                    <strong>{totalCurtidas}</strong>
                                    <span>Curtidas</span>
                                </div>

                                <div className="estatistica">
                                    <strong>{totalCompartilhamentos}</strong>
                                    <span>Compartilhamentos</span>
                                </div>
                            </section>

                            <section className="dados-conta">
                                <h2>Informações da conta</h2>

                                <div>
                                    <strong>E-mail</strong>
                                    <p>{conta.email}</p>
                                </div>

                                <div>
                                    <strong>Telefone</strong>
                                    <p>{conta.telefone || 'Não informado'}</p>
                                </div>
                            </section>

                            <section className="minhas-publicacoes">
                                <h2>Minhas publicações</h2>

                                {postagens.length === 0 && (
                                    <p>Você ainda não fez nenhuma publicação.</p>
                                )}

                                <div className="lista-minhas-publicacoes">
                                    {postagens.map(postagem => (
                                        <article
                                            className="minha-publicacao"
                                            key={postagem.id}
                                        >
                                            <div className="minha-publicacao-topo">
    <strong>{postagem.nome}</strong>
    <span>
        {new Date(postagem.data_postagem).toLocaleString('pt-BR')}
    </span>
</div>

{postagem.comunidade && (
    <span className="publicacao-comunidade">
        Comunidade: {{
            grajau: 'Grajaú',
            varginha: 'Varginha',
            'vila-sao-jose': 'Vila São José',
            interlagos: 'Interlagos'
        }[postagem.comunidade] || postagem.comunidade}
    </span>
)}

                                            <p>{postagem.conteudo}</p>

                                            {postagem.foto && (
                                                <img
                                                    src={urlDaImagem(postagem.foto)}
                                                    alt="Imagem da publicação"
                                                />
                                            )}

                                            <div className="minha-publicacao-acoes">
                                                <span>
                                                    <img src="/assets/images/curtidaSIM.svg" alt="Curtidas" /> {postagem.total_curtidas || 0} curtidas
                                                </span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </main>

            <nav className="feed-bottom-nav" aria-label="Navegação principal">
                <a className="bottom-nav-item" href="/feed">
                    <Icon name="home" size={19} />
                    <span>Início</span>
                </a>

                <a className="bottom-nav-item" href="/comunidade">
                    <Icon name="people" size={19} />
                    <span>Comunidade</span>
                </a>

                <a className="bottom-nav-item" href="/mapa">
                    <Icon name="map" size={19} />
                    <span>Mapa</span>
                </a>

                <a
                    className="bottom-nav-item is-current"
                    href="/conta"
                    aria-current="page"
                >
                    <Icon name="user" size={19} />
                    <span>Conta</span>
                </a>
            </nav>
        </div>
    );
}
