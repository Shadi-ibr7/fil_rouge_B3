import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(
                'http://localhost:3002/api/loginManage',
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, 
                }
            );
    
            if (response.status === 200) {
                console.log('Connexion réussie', response.data);
                navigate('/'); 
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Erreur de réseau');
            }
        }
    };

    return (
        <div className="login flex flex-col h-screen">
            <section className="flex flex-col items-center justify-center flex-grow">
                <h1 className="text-2xl font-bold mb-6">Connexion</h1>
                <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
                    <input
                        className="border border-gray-300 rounded-lg px-4 py-2"
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="adresse mail"
                    />
                    <input
                        className="border border-gray-300 rounded-lg px-4 py-2"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="mot de passe"
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        type="submit"
                    >
                        Envoyer
                    </button>
                </form>
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </section>
        </div>
    );
}

export default Login;
