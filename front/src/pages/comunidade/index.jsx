import './index.scss';
import Cabecalho from '../../components/header/index.jsx';

export default function Comunidade() {

      function sair() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }


    return (
        <div className="comunidade">
            <Cabecalho onSair={sair} />
        </div>
    )
}