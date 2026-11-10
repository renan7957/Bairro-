
import './index.scss';
import { useState, useEffect } from 'react';

export default function Feed() {
    const [postagens, setPostagens] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    function sair() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    // Buscar publicações
    async function buscarPostagens() {
        const token = localStorage.getItem('token');

        try {
            const resposta = await fetch('http://localhost:5050/postagem', {
                method: 'GET',
                headers: {
                    'x-access-token': token
                }
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error('Não foi possível carregar as publicações.');
            }

            setPostagens(dados);

        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarPostagens();
    }, []);

    // Curtir ou descurtir publicação
    async function alternarCurtida(postagem) {
        const token = localStorage.getItem('token');
        const curtiu = Number(postagem.curtiu) === 1;

        try {
            const resposta = await fetch(
                `http://localhost:5050/postagem/${postagem.id}/curtida`,
                {
                    method: curtiu ? 'DELETE' : 'POST',
                    headers: {
                        'x-access-token': token
                    }
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




    return (


        <div className="pag-feed">

            {/* Cabeçalho */}
            <header className="cabecalho">

                <a href="/inicio" className="logo">
                    <img
                        src="/assets/images/logo3.png"
                        alt="Bairro+ — Juntos por um bairro mais conectado!"
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
                        onClick={sair}
                    >
                        Sair
                    </button>
                </nav>

            </header>

            {/* Layout do feed */}
            <div className="layout-feed">

                {/* Aside da esquerda */}
                <aside
                    className="aside"
                    style={{
                        background: "url('/assets/images/fundo4.png') center / cover no-repeat"
                    }}
                >

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

                        <span className="icone-grupo">
                            <img src="/assets/images/grupo.png" alt="" />
                        </span>

                        <h2>
                            Juntos fazemos <br/>
                            um bairro <br />
                            melhor!
                        </h2>

                        <div className="imagem-bairro">
                            <img src="/assets/images/casinha2.png" alt="" />
                        </div>

                    </div>

                </aside>

                {/* Conteúdo principal */}
                <main className="conteudo-feed">

                    <section id="publicacoes" className="publicacoes">

                        <h1>Publicações do bairro</h1>

                        {carregando && (
                            <p>Carregando publicações...</p>
                        )}

                        {erro && (
                            <p className="mensagem-erro">{erro}</p>
                        )}

                        {!carregando && !erro && postagens.length === 0 && (
                            <p className="sem-publicacoes">
                                Ainda não existem publicações.
                            </p>
                        )}

                        {postagens.map((postagem) => (

                            <article
                                className="card-publicacao"
                                key={postagem.id}
                            >

                                <div className="cabecalho-publicacao">

                                    <div className="foto-perfil">
                                        <img
                                            src="/assets/images/user.svg"
                                            alt="Foto do usuário"
                                        />
                                    </div>

                                    <div className="info-publicacao">

                                        <h3>{postagem.nome}</h3>

                                        <span>
                                            {new Date(postagem.data_postagem).toLocaleString('pt-BR')}
                                        </span>

                                    </div>

                                </div>

                                <div className="texto-publicacao">
                                    <p>{postagem.conteudo}</p>
                                </div>

                                <div className="acoes-publicacao">

                                    <div className="acoes-publicacao">

                                        <button
                                            className="curtida"
                                            onClick={() => alternarCurtida(postagem)}
                                            aria-label="Curtir publicação"
                                        >
                                            <img
                                                src={
                                                    Number(postagem.curtiu) === 1
                                                        ? '/assets/images/curtidaSIM.svg'
                                                        : '/assets/images/curtidaNAO.svg'
                                                }
                                                alt=""
                                            />
                                        </button>

                                        <span>
                                            {postagem.total_curtidas || 0} curtidas
                                        </span>

                                    </div>



                                </div>

                            </article>

                        ))}

                    </section>

                </main>

                {/* Aside da direita */}
                <aside
                    className="aside2"
                    style={{
                        background: "url('/assets/images/fundo4.png') center / cover no-repeat"
                    }}
                >

                    <div className="card-eventos">

                        <div className="titulo-eventos">
                            <img src="/assets/images/calendario.svg" alt="" />
                            <h2>Próximos Eventos</h2>
                        </div>

                        <div className="evento">

                            <div className="img-evento">
                                <img src="/assets/images/bairrosp.jpg" alt="" />
                            </div>

                            <div className="info-evento">

                                <h3>Feira de Artesanato</h3>

                                <div className="info-evento2">
                                    <img src="/assets/images/calendario.svg" alt="" />
                                    <p>Sab, 28 de dezembro - 10:00</p>
                                </div>

                                <div className="info-evento2">
                                    <img src="/assets/images/mapa3.svg" alt="" />
                                    <p>Praça local</p>
                                </div>

                            </div>

                        </div>

                        <div className="evento">

                            <div className="img-evento">
                                <img src="/assets/images/bairrosp.jpg" alt="" />
                            </div>

                            <div className="info-evento">

                                <h3>Feira de Artesanato</h3>

                                <div className="info-evento2">
                                    <img src="/assets/images/calendario.svg" alt="" />
                                    <p>Sab, 28 de dezembro - 10:00</p>
                                </div>

                                <div className="info-evento2">
                                    <img src="/assets/images/mapa3.svg" alt="" />
                                    <p>Praça local</p>
                                </div>

                            </div>

                        </div>

                        <div className="evento">

                            <div className="img-evento">
                                <img src="/assets/images/bairrosp.jpg" alt="" />
                            </div>

                            <div className="info-evento">

                                <h3>Feira de Artesanato</h3>

                                <div className="info-evento2">
                                    <img src="/assets/images/calendario.svg" alt="" />
                                    <p>Sab, 28 de dezembro - 10:00</p>
                                </div>

                                <div className="info-evento2">
                                    <img src="/assets/images/mapa3.svg" alt="" />
                                    <p>Praça local</p>
                                </div>

                            </div>

                        </div>

                    </div>

                </aside>

            </div>

        </div>
    );
}
