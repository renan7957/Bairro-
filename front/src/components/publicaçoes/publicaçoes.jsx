import { useCallback, useEffect, useState } from 'react';
import './Publicacoes.scss';

const API_URL = 'http://localhost:5050';
const TIPOS_IMAGEM = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

function dataDoEvento(data) {
  if (!data) return 'Evento da comunidade';

  const dataFormatada = new Date(data);
  if (Number.isNaN(dataFormatada.getTime())) return 'Evento da comunidade';

  return dataFormatada.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function dataLocalParaInput(data = new Date()) {
  const deslocamento = data.getTimezoneOffset() * 60000;
  return new Date(data.getTime() - deslocamento).toISOString().slice(0, 16);
}

function urlDaImagem(foto) {
  if (!foto) return '';
  return foto.startsWith('/uploads/') ? `${API_URL}${foto}` : foto;
}

export default function Publicacoes() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [titulo, setTitulo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [previaFoto, setPreviaFoto] = useState('');
  const token = localStorage.getItem('token');

  const carregarEventos = useCallback(async () => {
    try {
      const resposta = await fetch(`${API_URL}/postagem`, {
        headers: { 'x-access-token': token }
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Não foi possível carregar os eventos.');
      }

      setEventos(Array.isArray(dados)
        ? dados
          .filter((item) => item.categoria === 'evento')
          .sort((a, b) => {
            const dataA = new Date(a.data_evento || a.data_postagem).getTime();
            const dataB = new Date(b.data_evento || b.data_postagem).getTime();
            return dataA - dataB;
          })
        : []);
      setErro('');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  function limparFormulario() {
    setTitulo('');
    setEndereco('');
    setDataEvento('');
    setDescricao('');
    setArquivoFoto(null);
    setPreviaFoto('');
    setErro('');
  }

  function fecharFormulario() {
    if (enviando) return;
    setModalAberto(false);
    limparFormulario();
  }

  function selecionarImagem(event) {
    const arquivo = event.target.files?.[0];
    setErro('');

    if (!arquivo) {
      setArquivoFoto(null);
      setPreviaFoto('');
      return;
    }

    if (!TIPOS_IMAGEM.includes(arquivo.type)) {
      setErro('Escolha uma imagem JPG, PNG, GIF ou WebP.');
      event.target.value = '';
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
      setErro('A imagem deve ter no máximo 5 MB.');
      event.target.value = '';
      return;
    }

    setArquivoFoto(arquivo);
    setPreviaFoto(URL.createObjectURL(arquivo));
  }

  async function adicionarEvento(event) {
    event.preventDefault();

    if (!titulo.trim() || !endereco.trim() || !dataEvento || !descricao.trim() || !arquivoFoto) {
      setErro('Preencha todos os campos, escolha a data e adicione uma imagem para o evento.');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      const formulario = new FormData();
      formulario.append('titulo', titulo.trim());
      formulario.append('endereco', endereco.trim());
      formulario.append('dataEvento', dataEvento);
      formulario.append('descricao', descricao.trim());
      formulario.append('categoria', 'evento');
      formulario.append('foto', arquivoFoto);

      const resposta = await fetch(`${API_URL}/postagem`, {
        method: 'POST',
        headers: { 'x-access-token': token },
        body: formulario
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Não foi possível salvar o evento.');
      }

      await carregarEventos();
      setModalAberto(false);
      limparFormulario();
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  async function excluirEvento(id) {
    try {
      const resposta = await fetch(`${API_URL}/postagem/${id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token }
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Não foi possível excluir o evento.');
      }

      setEventos((lista) => lista.filter((evento) => evento.id !== id));
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div className="publicacoes">
      <div className="eventos-heading">
        <h2>Próximos eventos</h2>
        <button
          className="adicionar-evento"
          type="button"
          onClick={() => {
            setErro('');
            setModalAberto(true);
          }}
        >
          + Adicionar
        </button>
      </div>

      {erro && !modalAberto && <p className="eventos-erro" role="alert">{erro}</p>}
      {carregando && <p className="eventos-vazio">Carregando eventos...</p>}
      {!carregando && eventos.length === 0 && (
        <p className="eventos-vazio">Ainda não há eventos. Adicione o primeiro!</p>
      )}

      <div className="eventos-lista">
        {eventos.map((evento) => (
          <article className="evento-item" key={evento.id}>
            {evento.foto
              ? <img className="evento-imagem" src={urlDaImagem(evento.foto)} alt="" />
              : <div className="evento-imagem evento-imagem-vazia" aria-hidden="true">📅</div>}
            <div className="evento-detalhes">
              <strong title={evento.titulo}>{evento.titulo || 'Evento comunitário'}</strong>
              <span>▣ {dataDoEvento(evento.data_evento || evento.data_postagem)}</span>
              <span>⌖ {evento.endereco || 'Local a confirmar'}</span>
              {evento.descricao && <p>{evento.descricao}</p>}
            </div>
            {Number(evento.minha) === 1 && (
              <button
                className="excluir-evento"
                type="button"
                onClick={() => excluirEvento(evento.id)}
                aria-label={`Excluir evento ${evento.titulo || ''}`}
                title="Excluir evento"
              >
                ×
              </button>
            )}
          </article>
        ))}
      </div>

      {modalAberto && (
        <div className="evento-modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) fecharFormulario();
        }}>
          <section
            className="evento-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="novo-evento-titulo"
          >
            <div className="evento-modal-heading">
              <div>
                <span>Comunidade</span>
                <h2 id="novo-evento-titulo">Adicionar evento</h2>
              </div>
              <button type="button" onClick={fecharFormulario} aria-label="Fechar formulário">×</button>
            </div>

            <form onSubmit={adicionarEvento}>
              <label>
                Nome do evento
                <input
                  type="text"
                  value={titulo}
                  onChange={(event) => setTitulo(event.target.value)}
                  placeholder="Ex.: Feira comunitária"
                  maxLength={120}
                  required
                />
              </label>

              <label>
                Endereço
                <input
                  type="text"
                  value={endereco}
                  onChange={(event) => setEndereco(event.target.value)}
                  placeholder="Rua, número ou ponto de referência"
                  maxLength={200}
                  required
                />
              </label>

              <label>
                Data e horário
                <input
                  type="datetime-local"
                  value={dataEvento}
                  onChange={(event) => setDataEvento(event.target.value)}
                  min={dataLocalParaInput()}
                  required
                />
              </label>

              <label>
                Descrição
                <textarea
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                  placeholder="Conte um pouco sobre o evento"
                  maxLength={1000}
                  rows={4}
                  required
                />
              </label>

              <label className="evento-upload">
                Imagem do evento
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={selecionarImagem}
                  required
                />
                <span>JPG, PNG, GIF ou WebP (até 5 MB)</span>
              </label>

              {previaFoto && (
                <img className="evento-previa" src={previaFoto} alt="Prévia da imagem do evento" />
              )}
              {erro && <p className="eventos-erro" role="alert">{erro}</p>}

              <div className="evento-form-acoes">
                <button className="evento-cancelar" type="button" onClick={fecharFormulario} disabled={enviando}>
                  Cancelar
                </button>
                <button className="evento-salvar" type="submit" disabled={enviando}>
                  {enviando ? 'Salvando...' : 'Adicionar evento'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
