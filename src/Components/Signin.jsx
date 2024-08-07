

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../Firebase.jsx';
import { useNavigate } from 'react-router-dom'; 
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'This email is already in use.';
            case 'auth/invalid-email':
                return 'Invalid email address.';
            case 'auth/operation-not-allowed':
                return 'Operation not allowed.';
            case 'auth/weak-password':
                return 'Password is too weak.';
            case 'auth/user-disabled':
                return 'User account is disabled.';
            case 'auth/user-not-found':
                return 'User not found.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            default:
                return 'An unknown error occurred.';
        }
    };

    const signupUser = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((value) => {
            alert("Success");
            navigate('/payment'); // Navigate to /payment on success
        })
            .catch((error) => setError(getErrorMessage(error.code)));
    }

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
        .then((result) => {
            alert("Google Sign-in Success");
            navigate('/payment'); // Navigate to /payment on success
        })
        .catch((error) => setError(getErrorMessage(error.code)));
    }

    return (
        <>
            <div className="hero bg-base-200 min-h-screen">
                <div className=" flex justify-center items-center flex-col">
                    <div className="text-black text-xl font-semibold mb-2">Sign in Page</div>
                    {error && <div className="text-red-500">{error}</div>}

                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70"
                        >
                            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                   
                    <label className="input input-bordered flex items-center gap-2 mt-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70"
                        >
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    
                    <div className=" text-center">
                        <button className="btn bg-stone-400 mt-3" onClick={signupUser}>Submit</button>
                        <button className="btn bg-stone-400 mt-3 ml-2" onClick={signInWithGoogle}>Sign in with Google</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signin;

