
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
          <a href="#contato">Contato</a>
          <a href="/login" className="botao-entrar">
            Entrar
          </a>
        </nav>

      </div>

      <section className='page'>

        <div className='mensagem'>
          <h1>Juntos por um <br></br> bairro mais <br></br> <span>conectado! </span> </h1>

          <p>Crie sua conta e faça parte de uma comunidade que <br></br> compartilha, ajuda e melhora o nosso bairro. </p>


          <div className='botoes-hero'>

            <a className='cadastro' href='/cadastro'>
              Criar conta

              <img src="/assets/images/arrow-right.svg" alt="" className="arrow-icon" />

            </a>

            <a className='login' href='/login'>
              Já tenho conta
            </a>

          </div>

        </div>


        <div className='orbita'>
          <img src='./assets/images/bairro-orbita.svg' />
        </div>
      </section>









      <section className='recursos'>


        <div className='cards'>
          <div className='icons'>
            <img src='/assets/images/message-circle-more.svg' />
          </div>

          <h1>Compartilhe</h1>

          <p>avise sobre eventos, <br></br> situacoes importantes <br></br>
            e o que acontece <br></br> no seu bairro
          </p>

        </div>



        <div className='cards'>
          <div className='icons'>
            <img src='/assets/images/users.svg' />
          </div>

          <h1>Conecte-se</h1>

          <p>Conheça seus vizinhos <br></br> e fortaleça a comunidade
          </p>

        </div>




        <div className='cards'>
          <div className='icons'>
            <img src='/assets/images/shield.svg' />
          </div>

          <h1>Mais segurança</h1>

          <p>Denuncie problemas <br></br> e ajude a manter o bairro <br></br>
            mais seguro
          </p>

        </div>




        <div className='cards'>
          <div className='icons'>
            <img src='/assets/images/mapa2.svg' />
          </div>

          <h1>Serviços locais</h1>

          <p>Encontre comercios, <br></br> serviços e tudo o que <br></br>
            você precisa por perto
          </p>

        </div>

      </section>



      <section className='pagina3'>

        <div className='bairroimg'>
          <img src='/assets/images/bairrosp.jpg' />
        </div>

        <div className='textos'>
          <span className='selo-sobre'>
            SOBRE O BAIRRO+
          </span>

          <h1>
            Uma rede social <br></br> para seu bairro.
          </h1>

          <p>O BAIRRO+ é uma plataforma feita para conectar <br></br>
            pessoas, facilitar a comunicação e fortelecer <br></br>
            a nossa comunidade.
          </p>
        </div>

      </section>


      <footer>

  <div className='footer-conteudo'>

    <div className='logofooter'>
      <img src='/assets/images/logo2.webp' />
    </div>

    <div className='footer4'>
      <div className='footer2'>
        <img src='/assets/images/mailbranco.svg' />
        <p>contato@gmail.com</p>
      </div>

      <div className='footer2'>
        <img src='/assets/images/telefone.svg' />
        <p>contato@gmail.com</p>
      </div>

      <div className='footer2'>
        <img src='/assets/images/mapa4.svg' />
        <p>contato@gmail.com</p>
      </div>
    </div>

    <div className='redes'>
      <div className='footer3'>
        <img src='/assets/images/face.png' />
      </div>
      <div className='footer3'>
        <img src='/assets/images/linkedin.jpg' />
      </div>
      <div className='footer3'>
        <img src='/assets/images/instagram.png' />
      </div>
    </div>

  </div>

  <p className='copyright'>© 2026 BAIRRO+. Todos os direitos reservados.</p>

</footer>


    </div>
  );
}