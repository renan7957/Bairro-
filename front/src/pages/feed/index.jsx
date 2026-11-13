import './index.scss';
import { useEffect, useState } from 'react';
import Publicaçoes from '../../components/publicaçoes/publicaçoes';

const filtros = [
    { value: 'todos', label: 'Todos' },
    { value: 'aviso', label: 'Avisos' },
    { value: 'evento', label: 'Eventos' },
    { value: 'duvida', label: 'Dúvidas' }   
];

const avisos = [
    { icone: 'water', titulo: 'Manutenção no fornecimento de água', detalhe: 'Hoje · 8h às 14h' },
    { icone: 'bolt', titulo: 'Interrupção de energia (manutenção)', detalhe: 'Dia 02/10 · 9h às 10h' },
    { icone: 'trash', titulo: 'Coleta de lixo reciclável', detalhe: 'Hoje · Bairro todo' }
];

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
        case 'person':
            return <svg {...common}><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="9" r="3" /><path d="M6.5 19a5.7 5.7 0 0 1 11 0" /></svg>;
        case 'camera':
            return <svg {...common}><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" /><circle cx="12" cy="12.5" r="3.2" /></svg>;
        case 'video':
            return <svg {...common}><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>;
        case 'pin':
            return <svg {...common}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
        case 'calendar':
            return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M7 14h3M7 17h3M14 14h3" /></svg>;
        case 'megaphone':
            return <svg {...common}><path d="m3 11 15-6v14L3 13v-2Z" /><path d="M7 14.5 9 21h4l-2-5.1M18 10h2a2 2 0 0 1 0 4h-2" /></svg>;
        case 'water':
            return <svg {...common}><path d="M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7Z" /><path d="M9 16a3 3 0 0 0 3 3" /></svg>;
        case 'bolt':
            return <svg {...common}><path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" /></svg>;
        case 'trash':
            return <svg {...common}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6" /></svg>;
        case 'home':
            return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" /></svg>;
        case 'people':
            return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5" /></svg>;
        case 'map':
            return <svg {...common}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></svg>;
        case 'comment':
            return <svg {...common}><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></svg>;
        case 'share':
            return <svg {...common}><path d="M12 16V3M7 8l5-5 5 5M5 13v7h14v-7" /></svg>;
        case 'arrow':
            return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7" /></svg>;
        case 'plus':
            return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
        case 'user':
            return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.8 3.1-6 7-6s7 2.2 7 6" /></svg>;
        case 'logout':
            return <svg {...common}><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>;
        default:
            return null;
    }
}

function formatarData(data) {
    const dataPostagem = new Date(data);
    if (Number.isNaN(dataPostagem.getTime())) return 'Agora · Comunidade';

    return dataPostagem.toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' · Comunidade';
}

export default function Feed() {
    const [postagens, setPostagens] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [filtro, setFiltro] = useState('todos');
    const [categoriaNova, setCategoriaNova] = useState('aviso');
    const [publicando, setPublicando] = useState(false);
    const [imagem, setImagem] = useState(null);

    function sair() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

        function adicionarFoto(e) {
        setImagem(URL.createObjectURL(e.target.files[0]));
    }

    async function buscarPostagens() {
        const token = localStorage.getItem('token');

        try {
            const resposta = await fetch('http://localhost:5050/postagem', {
                method: 'GET',
                headers: { 'x-access-token': token }
            });
            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Não foi possível carregar as publicações.');
            }

            setPostagens(dados);
            setErro('');
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarPostagens();
    }, []);

    async function alternarCurtida(postagem) {
        const token = localStorage.getItem('token');
        const curtiu = Number(postagem.curtiu) === 1;

        try {
            const resposta = await fetch(
                'http://localhost:5050/postagem/' + postagem.id + '/curtida',
                {
                    method: curtiu ? 'DELETE' : 'POST',
                    headers: { 'x-access-token': token }
                }
            );

            if (!resposta.ok) {
                throw new Error('Não foi possível atualizar a curtida.');
            }

            await buscarPostagens();
        } catch (error) {
            setErro(error.message);
        }
    }

    async function apagarPublicacao(idPostagem) {
        const token = localStorage.getItem('token');

        try {
            const resposta = await fetch(
                'http://localhost:5050/postagem/' + idPostagem,
                {
                    method: 'DELETE',
                    headers: { 'x-access-token': token }
                }
            );
            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Não foi possível apagar a publicação.');
            }

            setPostagens((lista) => lista.filter((postagem) => postagem.id !== idPostagem));
        } catch (error) {
            setErro(error.message);
        }
    }

    async function publicar(event) {
        event.preventDefault();
        const texto = conteudo.trim();

        if (!texto) {
            setErro('Digite alguma coisa antes de publicar.');
            return;
        }

        setPublicando(true);
        setErro('');

        try {
            const resposta = await fetch('http://localhost:5050/postagem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    conteudo: texto,
                    categoria: categoriaNova
                })
            });
            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Não foi possível publicar.');
            }

            setConteudo('');
            await buscarPostagens();
        } catch (error) {
            setErro(error.message);
        } finally {
            setPublicando(false);
        }
    }

    const postagensFiltradas = postagens.filter((postagem) => (
        filtro === 'todos' || postagem.categoria === filtro
    ));

    return (
        <div className="pag-feed">
            <header className="feed-topbar">
                <a href="/feed" className="feed-logo" aria-label="Bairro+, início">
                    <img
                        src="/assets/images/logo3.png"
                        alt="Bairro+ — Juntos por um bairro mais conectado"
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

           
                        
                      <button className="header-icon-button" onClick={sair}
                      aria-label="logout">
                        <Icon name="logout" size={22} />
                      </button>
                 
                </div>
            </header>

            <div className="feed-layout">
                <main className="feed-main">
                    <div className="feed-stream">
                        <section className="composer-card" aria-label="Criar publicação">
                            <div className="composer-input-row">
                                <div className="avatar-placeholder">
                                    <Icon name="person" size={23} />
                                </div>
                                <form id="composer-form" className="composer-form" onSubmit={publicar}>
                                    <input
                                        type="text"
                                        value={conteudo}
                                        onChange={(event) => setConteudo(event.target.value)}
                                        placeholder="O que você quer compartilhar com o bairro?"
                                        aria-label="Conteúdo da publicação"
                                    />
                                                </form>

                                                <div className="preview">
                                {imagem && (
                                    <img src={imagem} alt="Foto selecionada" />
                                    )}
                                    </div>

                            </div>

                     

                            <div className="composer-toolbar">
                                <div className="composer-tools" aria-label="Opções de publicação">
                                    <button className="composer-tool" type="button" disabled title="Disponível em breve">
                                        <Icon name="camera" size={16} />
                                                                        <div>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="foto"
                                                onChange={adicionarFoto}
                                                hidden
                                            />

                                            <label htmlFor="foto" className="btn-foto">
                                                foto
                                            </label>

                                            {imagem && (
                                                <img src={imagem} alt="Foto selecionada" />
                                            )}

                                        </div>
                                    </button>
                                    <button className="composer-tool" type="button" disabled title="Disponível em breve">
                                        <Icon name="video" size={16} />
                                        <span>Vídeo</span>
                                    </button>
                                    <button className="composer-tool" type="button" disabled title="Disponível em breve">
                                        <Icon name="pin" size={16} />
                                        <span>Localização</span>
                                    </button>

                                    
                            <label className="compose-category">
                                <span>Categoria</span>
                                <select
                                    value={categoriaNova}
                                    onChange={(event) => setCategoriaNova(event.target.value)}
                                    aria-label="Categoria da publicação"
                                >
                                    <option value="aviso">Aviso</option>
                                    <option value="evento">Evento</option>
                                    <option value="duvida">Dúvida</option>
                                </select>
                            </label>

                                </div>

                                <button
                                    className="publish-button"
                                    type="submit"
                                    form="composer-form"
                                    disabled={publicando}
                                >
                                    <Icon name="plus" size={16} />
                                    <span>{publicando ? 'Publicando...' : 'Criar postagem'}</span>
                                </button>
                            </div>

                            {erro && <p className="feed-error" role="alert">{erro}</p>}
                        </section>

                        <section className="posts-section" id="publicaçoes">
                            <div className="posts-heading">
                                <h1>Publicações do bairro</h1>
                                <span className="post-count">{postagensFiltradas.length}</span>
                            </div>

                            <div className="feed-filters" aria-label="Filtrar publicações">
                                {filtros.map((item) => (
                                    <button
                                        key={item.value}
                                        className={'filter-chip ' + (filtro === item.value ? 'is-active' : '')}
                                        type="button"
                                        aria-pressed={filtro === item.value}
                                        onClick={() => setFiltro(item.value)}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {carregando && <p className="empty-feed">Carregando publicações...</p>}

                            {!carregando && erro && (
                                <p className="empty-feed" role="alert">{erro}</p>
                            )}

                            {!carregando && !erro && postagensFiltradas.length === 0 && (
                                <p className="empty-feed">
                                    {filtro === 'todos'
                                        ? 'Ainda não existem publicações.'
                                        : 'Ainda não existem publicações nesta categoria.'}
                                </p>
                            )}

                            <div className="post-list">
                                {postagensFiltradas.map((postagem) => (
                                    <article className="post-card" key={postagem.id}>
                                        <div className="post-header">
                                            <div className="avatar-placeholder post-avatar">
                                                <Icon name="person" size={22} />
                                            </div>
                                            <div className="post-author">
                                                <strong>{postagem.nome}</strong>
                                                <span>{formatarData(postagem.data_postagem)}</span>
                                            </div>

                                            {Number(postagem.minha) === 1 && (
                                                <button
                                                    className="delete-post-button"
                                                    type="button"
                                                    onClick={() => apagarPublicacao(postagem.id)}
                                                    aria-label="Apagar publicação"
                                                    title="Apagar publicação"
                                                >
                                                    <Icon name="trash" size={18} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="post-content">
                                            {postagem.categoria && postagem.categoria !== 'todos' && (
                                                <span className="post-category">
                                                    {postagem.categoria === 'aviso' && 'Aviso'}
                                                    {postagem.categoria === 'evento' && 'Evento'}
                                                    {postagem.categoria === 'duvida' && 'Dúvida'}
                                                </span>
                                            )}
                                            <p>{postagem.conteudo}</p>
                                        </div>

                                        <div className="post-actions">
                                            <button
                                                className={'like-action ' + (Number(postagem.curtiu) === 1 ? 'liked' : '')}
                                                type="button"
                                                onClick={() => alternarCurtida(postagem)}
                                                aria-label={Number(postagem.curtiu) === 1 ? 'Descurtir publicação' : 'Curtir publicação'}
                                            >
                                                <img
                                                    src={Number(postagem.curtiu) === 1
                                                        ? '/assets/images/curtidaSIM.svg'
                                                        : '/assets/images/curtidaNAO.svg'}
                                                    alt=""
                                                />
                                                <span>{postagem.total_curtidas || 0}</span>
                                            </button>
                                            <span className="post-action-static">
                                                <Icon name="comment" size={17} />
                                                Comentários
                                            </span>
                                            <span className="post-action-static">
                                                <Icon name="share" size={17} />
                                                Compartilhar
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>

                <aside className="feed-sidebar">
                    <section className="sidebar-card events-card">
                        <Publicaçoes />
                    </section>

                    <section className="sidebar-card notices-card">
                        <div className="sidebar-card-heading notices-heading">
                            <div className="sidebar-title">
                                <Icon name="megaphone" size={23} />
                                <h2>Avisos recentes</h2>
                                </div>
                        </div>

                        <div className="notice-list">
                            {avisos.map((aviso) => (
                                <article className="notice-item" key={aviso.titulo}>
                                    <span className="notice-icon"><Icon name={aviso.icone} size={18} /></span>
                                    <span className="notice-copy">
                                        <strong>{aviso.titulo}</strong>
                                        <span>{aviso.detalhe}</span>
                                    </span>
                                </article>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>

            <nav className="feed-bottom-nav" aria-label="Navegação principal">
                <a className="bottom-nav-item is-current" href="/feed" aria-current="page">
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
                
                <a className="bottom-nav-item" href="/conta">
                    <Icon name="user" size={19} />
                    <span>Conta</span>
                </a>
            </nav>
        </div>
    );
}
