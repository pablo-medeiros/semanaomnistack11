import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiPower, FiTrash2} from 'react-icons/fi';

import api from '../../services/api';
import './styles.css'
import logoImg from '../../assets/logo.svg';

export default function Profile(){
    const [incidents, setIncidents] = useState([]);
    const id = localStorage.getItem('ongId');
    const name = localStorage.getItem('ongName');
    const history = useHistory();

    useEffect(()=>{
        api.get('profile',{
            headers:{
                Authorization: id,
            }
        }).then(response=>{
            setIncidents(response.data);
       });
    },[id])

    async function handleDeleteIncident(i){
        try{
            await api.delete(`incidents/${i}`,{
                headers:{
                    Authorization: id,
                }
            });
            setIncidents(incidents.filter(incident => incident.id !== i))
        }catch(err){
            alert('Erro ao deletar o caso, tente novamente.');
        }
    }

    function handleLogout(){
        localStorage.clear();
        history.push('/');
    }

    return(
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
                <span>Bem vindo(a), {name}</span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041"/>
                </button>
            </header>
            <h1>Casos cadastrados</h1>
            <ul>
                {incidents.map(incident=>(
                <li key={incident.id}>
                    <strong>CASO:</strong>
                    <p>{incident.title}</p>
    
                    <strong>DESCRIÇÃO:</strong>
                    <p>{incident.description}</p>
                    
                    <strong>VALOR:</strong>
                    <p>{Intl.NumberFormat('pt-BR',{style: 'currency', currency: 'BRL'}).format(incident.value)}</p>
                    <button type="button" onClick={()=>handleDeleteIncident(incident.id)}>
                        <FiTrash2 size={20} color="#a8a8a3"/>
                    </button>
                </li>
                ))};
            </ul>
        </div>
    );
}