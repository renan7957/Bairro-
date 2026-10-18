
import './App.scss';

export default function App() {
  return (
    <div className="App">

      <div className="cabecalho">
        <a href="#inicio" className="logo">
          <img src="/assets/images/logo3.png" alt="BAIRRO+ — Juntos por um bairro mais conectado!" />
        </a>

        <nav className="menu">
          <a href="#inicio">Início</a>
          <a href="#sobre">Sobre</a>
          <a href="#recursos">Recursos</a>
          <a href="#contato">Contato</a>
          <a href="/login" className="botao-entrar">
            Entrar
          </a>
        </nav>

      </div>

      <section className='page'>

        <div className='mensagem'>
          <h1>Conecte-se com seu bairro!</h1>
          <p>o BAIRRO+ é uma rede social feita para <br></br>
            aproximar vizinhos, fortalecer a comunidade<br></br>
            e tornar o seu bairro um lugar mais seguro<br></br>
            e unido! </p>

          <a href='/cadastro'>
            Comece Ja!</a>
        </div>


        <div className='orbita'>
             <img src='./assets/images/bairro-orbita.svg' />
        </div>
      </section>











    </div>
  );
}