import { useEffect, useMemo, useRef, useState } from 'react';

const API_URL = 'http://localhost:5050';
const TILE_SIZE = 256;
const DEFAULT_CENTER = { latitude: -23.5505, longitude: -46.6333 };
const CATEGORIAS = [
    { value: 'ocorrencia', label: 'Problema no bairro', symbol: '!' },
    { value: 'aviso', label: 'Aviso', symbol: 'i' },
    { value: 'evento', label: 'Evento', symbol: '★' },
    { value: 'duvida', label: 'Dúvida', symbol: '?' }
];

function limitarLatitude(latitude) {
    return Math.max(-85.05112878, Math.min(85.05112878, latitude));
}

function projetar(latitude, longitude, zoom) {
    const escala = TILE_SIZE * (2 ** zoom);
    const latRad = limitarLatitude(latitude) * Math.PI / 180;

    return {
        x: ((longitude + 180) / 360) * escala,
        y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * escala
    };
}

function desprojetar(x, y, zoom) {
    const escala = TILE_SIZE * (2 ** zoom);
    const longitude = x / escala * 360 - 180;
    const n = Math.PI - 2 * Math.PI * y / escala;

    return {
        latitude: 180 / Math.PI * Math.atan(Math.sinh(n)),
        longitude
    };
}

function obterTiles(centro, zoom, tamanho) {
    if (!tamanho.width || !tamanho.height) return [];

    const pixelCentro = projetar(centro.latitude, centro.longitude, zoom);
    const numeroTiles = 2 ** zoom;
    const xInicial = Math.floor((pixelCentro.x - tamanho.width / 2) / TILE_SIZE) - 1;
    const xFinal = Math.floor((pixelCentro.x + tamanho.width / 2) / TILE_SIZE) + 1;
    const yInicial = Math.max(0, Math.floor((pixelCentro.y - tamanho.height / 2) / TILE_SIZE) - 1);
    const yFinal = Math.min(numeroTiles - 1, Math.floor((pixelCentro.y + tamanho.height / 2) / TILE_SIZE) + 1);
    const tiles = [];

    for (let x = xInicial; x <= xFinal; x += 1) {
        for (let y = yInicial; y <= yFinal; y += 1) {
            const xUrl = ((x % numeroTiles) + numeroTiles) % numeroTiles;
            tiles.push({
                key: `${zoom}-${x}-${y}`,
                url: `https://tile.openstreetmap.org/${zoom}/${xUrl}/${y}.png`,
                left: x * TILE_SIZE - pixelCentro.x + tamanho.width / 2,
                top: y * TILE_SIZE - pixelCentro.y + tamanho.height / 2
            });
        }
    }

    return tiles;
}

function categoriaDoPost(postagem) {
    return CATEGORIAS.find((item) => item.value === postagem.categoria) || CATEGORIAS[0];
}

function formatarData(data) {
    if (!data) return '';
    const dataFormatada = new Date(data);
    if (Number.isNaN(dataFormatada.getTime())) return '';

    return dataFormatada.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function Mapa() {
    const containerRef = useRef(null);
    const arrasteRef = useRef(null);
    const [tamanho, setTamanho] = useState({ width: 0, height: 0 });
    const [centro, setCentro] = useState(DEFAULT_CENTER);
    const [zoom, setZoom] = useState(13);
    const [arrastando, setArrastando] = useState(false);
    const [postagens, setPostagens] = useState([]);
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('São Paulo - SP, Brasil');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('ocorrencia');
    const [pontoSelecionado, setPontoSelecionado] = useState(null);
    const [postagemAtiva, setPostagemAtiva] = useState(null);
    const [localizando, setLocalizando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        const observador = new ResizeObserver(([entrada]) => {
            setTamanho({
                width: entrada.contentRect.width,
                height: entrada.contentRect.height
            });
        });
        observador.observe(container);

        return () => observador.disconnect();
    }, []);

    useEffect(() => {
        let ativo = true;

        async function carregarPostagens() {
            try {
                const resposta = await fetch(`${API_URL}/postagem`, {
                    headers: { 'x-access-token': localStorage.getItem('token') }
                });
                const dados = await resposta.json();
                if (!resposta.ok) {
                    throw new Error(dados.erro || 'Não foi possível carregar os locais do mapa.');
                }
                if (ativo) setPostagens(Array.isArray(dados) ? dados : []);
            } catch (erroCarregamento) {
                if (ativo) setErro(erroCarregamento.message);
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarPostagens();
        const intervalo = setInterval(carregarPostagens, 60 * 1000);
        return () => {
            ativo = false;
            clearInterval(intervalo);
        };
    }, []);

    const tiles = useMemo(() => obterTiles(centro, zoom, tamanho), [centro, zoom, tamanho]);
    const pontosNoMapa = useMemo(() => postagens.filter((postagem) => (
        Number.isFinite(Number(postagem.latitude))
        && Number.isFinite(Number(postagem.longitude))
        && postagem.latitude !== null
        && postagem.longitude !== null
    )), [postagens]);

    function sair() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    function definirLocal(latitude, longitude) {
        const novoPonto = {
            latitude: Number(latitude),
            longitude: Number(longitude)
        };
        setPontoSelecionado(novoPonto);
        setCentro(novoPonto);
        setZoom((valor) => Math.max(valor, 16));
        setPostagemAtiva(null);
        setMensagem('Confira o ponto no mapa. Você também pode clicar no mapa para ajustar o local.');
        setErro('');
    }

    async function localizarRua(event) {
        event.preventDefault();
        const rua = endereco.trim();
        const municipio = cidade.trim();

        if (!rua || !municipio) {
            setErro('Informe a rua e a cidade para localizar o ponto.');
            return;
        }

        setLocalizando(true);
        setErro('');
        setMensagem('');

        try {
            const consulta = new URLSearchParams({
                format: 'jsonv2',
                limit: '1',
                countrycodes: 'br',
                q: `${rua}, ${municipio}`
            });
            const resposta = await fetch(`https://nominatim.openstreetmap.org/search?${consulta}`);
            if (!resposta.ok) {
                throw new Error('O serviço de busca de endereços está indisponível. Tente novamente.');
            }

            const resultados = await resposta.json();
            if (!resultados.length) {
                throw new Error('Não encontrei esse endereço. Confira a rua e a cidade ou marque o ponto diretamente no mapa.');
            }

            definirLocal(resultados[0].lat, resultados[0].lon);
        } catch (erroBusca) {
            setErro(erroBusca.message);
        } finally {
            setLocalizando(false);
        }
    }

    async function publicarOcorrencia(event) {
        event.preventDefault();
        if (!pontoSelecionado) {
            setErro('Localize a rua ou clique no mapa para escolher o ponto antes de publicar.');
            return;
        }
        if (!titulo.trim()) {
            setErro('Informe um título para o aviso do mapa.');
            return;
        }

        setSalvando(true);
        setErro('');
        setMensagem('');

        try {
            const resposta = await fetch(`${API_URL}/postagem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    conteudo: titulo.trim(),
                    titulo: titulo.trim(),
                    descricao: descricao.trim(),
                    endereco: `${endereco.trim()}, ${cidade.trim()}`,
                    categoria,
                    latitude: pontoSelecionado.latitude,
                    longitude: pontoSelecionado.longitude
                })
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                throw new Error(dados.erro || 'Não foi possível publicar este local.');
            }

            setPostagens((lista) => [{
                id: dados.id,
                titulo: titulo.trim(),
                conteudo: titulo.trim(),
                descricao: descricao.trim(),
                endereco: `${endereco.trim()}, ${cidade.trim()}`,
                categoria,
                latitude: pontoSelecionado.latitude,
                longitude: pontoSelecionado.longitude,
                data_postagem: new Date().toISOString(),
                minha: 1
            }, ...lista]);
            setTitulo('');
            setDescricao('');
            setPontoSelecionado(null);
            setMensagem('Local adicionado ao mapa.');
        } catch (erroPublicacao) {
            setErro(erroPublicacao.message);
        } finally {
            setSalvando(false);
        }
    }

    function iniciarArraste(event) {
        if (event.target.closest('button, a')) return;
        const pixelCentro = projetar(centro.latitude, centro.longitude, zoom);
        arrasteRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            centroX: pixelCentro.x,
            centroY: pixelCentro.y,
            moveu: false
        };
        setArrastando(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function moverMapa(event) {
        const arraste = arrasteRef.current;
        if (!arraste || arraste.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - arraste.x;
        const deltaY = event.clientY - arraste.y;
        if (Math.abs(deltaX) + Math.abs(deltaY) > 4) arraste.moveu = true;

        setCentro(desprojetar(arraste.centroX - deltaX, arraste.centroY - deltaY, zoom));
    }

    function finalizarArraste(event) {
        const arraste = arrasteRef.current;
        if (!arraste || arraste.pointerId !== event.pointerId) return;

        if (!arraste.moveu && containerRef.current) {
            const retangulo = containerRef.current.getBoundingClientRect();
            const pixelCentro = projetar(centro.latitude, centro.longitude, zoom);
            const ponto = desprojetar(
                pixelCentro.x + event.clientX - retangulo.left - retangulo.width / 2,
                pixelCentro.y + event.clientY - retangulo.top - retangulo.height / 2,
                zoom
            );
            setPontoSelecionado(ponto);
            setPostagemAtiva(null);
            setMensagem('Ponto marcado manualmente no mapa.');
            setErro('');
        }

        arrasteRef.current = null;
        setArrastando(false);
    }

    function centralizarMinhaLocalizacao() {
        if (!navigator.geolocation) {
            setErro('Este navegador não oferece acesso à localização.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setCentro({ latitude: coords.latitude, longitude: coords.longitude });
                setZoom(16);
                setErro('');
            },
            () => setErro('Não foi possível acessar sua localização. Verifique a permissão do navegador.'),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function focarPostagem(postagem) {
        const local = { latitude: Number(postagem.latitude), longitude: Number(postagem.longitude) };
        setCentro(local);
        setZoom((valor) => Math.max(valor, 16));
        setPostagemAtiva(postagem.id);
    }

    function posicionarNoMapa(local) {
        const pixelCentro = projetar(centro.latitude, centro.longitude, zoom);
        const pixelPonto = projetar(Number(local.latitude), Number(local.longitude), zoom);

        return {
            left: pixelPonto.x - pixelCentro.x + tamanho.width / 2,
            top: pixelPonto.y - pixelCentro.y + tamanho.height / 2
        };
    }

    const marcadoresRecentes = [...pontosNoMapa].slice(0, 8);

    return (
        <div className="mapa-page">
            <header className="mapa-header">
                <a href="/feed" className="mapa-logo" aria-label="Bairro+, voltar ao feed">
                    <img src="/assets/images/logo3.png" alt="Bairro+" />
                </a>
                <h1>Mapa do bairro</h1>
                <button className="mapa-sair" type="button" onClick={sair}>Sair</button>
            </header>

            <main className="mapa-content">
                <section className="mapa-area" aria-label="Mapa interativo">
                    <div
                        className={`mapa-viewport${arrastando ? ' is-dragging' : ''}`}
                        ref={containerRef}
                        onPointerDown={iniciarArraste}
                        onPointerMove={moverMapa}
                        onPointerUp={finalizarArraste}
                        onPointerCancel={() => {
                            arrasteRef.current = null;
                            setArrastando(false);
                        }}
                    >
                        {tiles.map((tile) => (
                            <img
                                key={tile.key}
                                className="mapa-tile"
                                src={tile.url}
                                alt=""
                                draggable="false"
                                style={{ left: tile.left, top: tile.top }}
                            />
                        ))}

                        {pontosNoMapa.map((postagem) => {
                            const posicao = posicionarNoMapa(postagem);
                            if (
                                posicao.left < -30
                                || posicao.top < -46
                                || posicao.left > tamanho.width + 30
                                || posicao.top > tamanho.height + 46
                            ) return null;

                            const tipo = categoriaDoPost(postagem);
                            return (
                                <button
                                    key={postagem.id}
                                    type="button"
                                    className={`mapa-pin mapa-pin-${tipo.value}${postagemAtiva === postagem.id ? ' is-active' : ''}`}
                                    style={{ left: posicao.left, top: posicao.top }}
                                    title={`${postagem.titulo || postagem.conteudo} — ${postagem.endereco || 'Local informado'}`}
                                    aria-label={`${tipo.label}: ${postagem.titulo || postagem.conteudo}`}
                                    onPointerDown={(event) => event.stopPropagation()}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setPostagemAtiva(postagemAtiva === postagem.id ? null : postagem.id);
                                    }}
                                >
                                    <span>{tipo.symbol}</span>
                                </button>
                            );
                        })}

                        {pontoSelecionado && (() => {
                            const posicao = posicionarNoMapa(pontoSelecionado);
                            return (
                                <span
                                    className="mapa-pin mapa-pin-pendente"
                                    style={{ left: posicao.left, top: posicao.top }}
                                    aria-label="Novo local selecionado"
                                >
                                    +
                                </span>
                            );
                        })()}

                        {postagens.map((postagem) => (
                            postagemAtiva === postagem.id ? (
                                <div
                                    className="mapa-popup"
                                    key={`popup-${postagem.id}`}
                                    style={posicionarNoMapa(postagem)}
                                >
                                    <strong>{postagem.titulo || postagem.conteudo}</strong>
                                    <span>{postagem.endereco || 'Endereço não informado'}</span>
                                    {postagem.descricao && postagem.descricao !== postagem.conteudo && (
                                        <p>{postagem.descricao}</p>
                                    )}
                                    <small>{formatarData(postagem.data_postagem)}</small>
                                </div>
                            ) : null
                        ))}

                        <div className="mapa-zoom-controls" aria-label="Controles de zoom">
                            <button type="button" onClick={() => setZoom((valor) => Math.min(19, valor + 1))} aria-label="Aumentar zoom">+</button>
                            <button type="button" onClick={() => setZoom((valor) => Math.max(4, valor - 1))} aria-label="Diminuir zoom">−</button>
                        </div>
                        <button
                            className="mapa-localizacao-button"
                            type="button"
                            onClick={centralizarMinhaLocalizacao}
                            aria-label="Centralizar na minha localização"
                            title="Usar minha localização"
                        >
                            ◎
                        </button>
                        <div className="mapa-instrucao">Arraste para mover · Clique para marcar um local</div>
                        <div className="mapa-atribuicao">
                            © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>
                        </div>
                    </div>
                    {postagemAtiva && (
                        <button
                            type="button"
                            className="mapa-fechar-popup"
                            onClick={() => setPostagemAtiva(null)}
                        >
                            Fechar detalhes
                        </button>
                    )}
                </section>

                <aside className="mapa-sidebar">
                    <section className="mapa-card mapa-form-card">
                        <div className="mapa-card-heading">
                            <span className="mapa-heading-icon">⌖</span>
                            <div>
                                <h2>Adicionar ao mapa</h2>
                                <p>Compartilhe um local importante do bairro.</p>
                            </div>
                        </div>

                        <form className="mapa-form" onSubmit={publicarOcorrencia}>
                            <label>
                                O que está acontecendo?
                                <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
                                    {CATEGORIAS.map((item) => (
                                        <option key={item.value} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Título
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(event) => setTitulo(event.target.value)}
                                    placeholder="Ex.: Buraco na rua"
                                    maxLength={120}
                                    required
                                />
                            </label>
                            <label>
                                Rua ou endereço
                                <input
                                    type="text"
                                    value={endereco}
                                    onChange={(event) => {
                                        setEndereco(event.target.value);
                                        setPontoSelecionado(null);
                                    }}
                                    placeholder="Ex.: Rua das Flores, 120"
                                    maxLength={200}
                                    required
                                />
                            </label>
                            <label>
                                Cidade
                                <input
                                    type="text"
                                    value={cidade}
                                    onChange={(event) => {
                                        setCidade(event.target.value);
                                        setPontoSelecionado(null);
                                    }}
                                    maxLength={100}
                                    required
                                />
                            </label>
                            <button
                                className="mapa-localizar-button"
                                type="button"
                                onClick={localizarRua}
                                disabled={localizando}
                            >
                                {localizando ? 'Localizando rua...' : 'Localizar no mapa'}
                            </button>
                            <label>
                                Descrição (opcional)
                                <textarea
                                    value={descricao}
                                    onChange={(event) => setDescricao(event.target.value)}
                                    placeholder="Inclua detalhes que ajudem os vizinhos."
                                    rows={3}
                                    maxLength={1000}
                                />
                            </label>

                            {pontoSelecionado && (
                                <p className="mapa-ponto-confirmado" role="status">
                                    Local marcado no mapa. Clique no mapa para ajustar o ponto.
                                </p>
                            )}
                            {erro && <p className="mapa-feedback mapa-erro" role="alert">{erro}</p>}
                            {mensagem && <p className="mapa-feedback mapa-sucesso" role="status">{mensagem}</p>}

                            <button className="mapa-publicar-button" type="submit" disabled={salvando || !pontoSelecionado}>
                                {salvando ? 'Publicando...' : 'Publicar no mapa'}
                            </button>
                            <small className="mapa-privacidade">
                                A busca do endereço é feita pelo OpenStreetMap. O endereço informado fica visível no mapa.
                            </small>
                        </form>
                    </section>

                    <section className="mapa-card mapa-legenda-card">
                        <h2>Ícones no mapa</h2>
                        <div className="mapa-legenda">
                            {CATEGORIAS.map((item) => (
                                <span key={item.value}>
                                    <i className={`mapa-legenda-pin mapa-pin-${item.value}`}>{item.symbol}</i>
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="mapa-card mapa-recentes-card">
                        <div className="mapa-recentes-heading">
                            <h2>Locais recentes</h2>
                            <span>{pontosNoMapa.length}</span>
                        </div>
                        {carregando && <p className="mapa-sem-itens">Carregando locais...</p>}
                        {!carregando && marcadoresRecentes.length === 0 && (
                            <p className="mapa-sem-itens">Ainda não há locais marcados. Adicione o primeiro!</p>
                        )}
                        <div className="mapa-lista">
                            {marcadoresRecentes.map((postagem) => (
                                <button
                                    className="mapa-local-item"
                                    key={postagem.id}
                                    type="button"
                                    onClick={() => focarPostagem(postagem)}
                                >
                                    <i className={`mapa-legenda-pin mapa-pin-${categoriaDoPost(postagem).value}`}>
                                        {categoriaDoPost(postagem).symbol}
                                    </i>
                                    <span>
                                        <strong>{postagem.titulo || postagem.conteudo}</strong>
                                        <small>{postagem.endereco || 'Endereço não informado'}</small>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                </aside>
            </main>

            <nav className="mapa-bottom-nav" aria-label="Navegação principal">
                <a href="/feed"><span>⌂</span>Início</a>
                <a href="/comunidade"><span>♧</span>Comunidade</a>
                <a href="/mapa" aria-current="page"><span>⌖</span>Mapa</a>
            </nav>
        </div>
    );
}
