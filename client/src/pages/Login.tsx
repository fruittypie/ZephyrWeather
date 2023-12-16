import MyNavbar from "../components/NavBar";
import axios  from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const Login = () => {
    const [email, setEmail] = useState<string | undefined>('');
    const [password, setPassword] = useState<string | undefined>('');
    const [userToken, setUserToken] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            setEmailError('Email is required');
            return;
        }
        if (!password) {
            setPasswordError('Password is required');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/login', {email, password});
            if (response.data.success) {
                const token = response.data.token;
                setUserToken(token);
                navigate('/')
            } else {
                setPasswordError('Invalid username or password');
            }
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <>
        <section className="gradient-custom">
            <MyNavbar/>
            <div className="container py-4 login-container">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-6 col-sm-10">
                        <div className="card bg-body text-dark shadow-lg" style={{borderRadius: "1rem"}}>
                            <div className="card-body p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-md-5 mt-md-4 pb-3">
                                    <h2 className="fw-bold mb-2 text-uppercase text-center">Login</h2>
                                    <p className="text-dark-50 mb-5 text-center">Enter your login and password</p>
                                    <div className="form-outline form-white mb-4">
                                        <label className="form-label" htmlFor="typeEmailX">Email</label>
                                        <input 
                                        type="email"
                                        className="form-control"
                                        onChange={(e) => {
                                            setEmail(e.target.value) 
                                            if (e.target.value === '') {
                                                setEmailError("Email is required")
                                            }  else {
                                                setEmailError('')
                                            }  
                                        }}
                                        />
                                        <div className="invalid-email" style={{color: "red", fontSize:"12px", padding: "5px"}}>
                                            {emailError}
                                        </div>
                                    </div>
                                    <div className="form-outline form-white mb-4">
                                        <label className="form-label" htmlFor="typePasswordX">Password</label>
                                        <input 
                                        type="password"
                                        className="form-control"
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (e.target.value === '') {
                                                setPasswordError("Password is required")
                                            } else {
                                                setPasswordError('')
                                            }
                                        }}
                                        />
                                    <div className="invalid-password" style={{color: "red", fontSize:"12px", padding: "5px"}}>
								    	{passwordError}
							    	</div>
                                        <p className="small mb-5 pb-lg-2 pt-1">
                                            <a className="text-black-50" href="#!">Forgot password?</a>
                                        </p>
                                    </div>  
                                    <button className="btn btn-outline-dark btn-lg px-5" type="submit">Login</button>  
                                </div>
                            </form>
                            <div>
                                <p className="mb-0 text-black-50 text-center">
                                        Don't have an account? 
                                    <Link className="nav-link text-black-50 fw-bold" to="/register">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
    );
}

export default Login;