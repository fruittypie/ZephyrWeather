import MyNavbar from "../components/NavBar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from 'email-validator';
import axios from "axios";


export const Register = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const isValid = validator.validate(email);
        if (!isValid) {
            setEmailError('Invalid email format');
            return;
        }
        if (!name) {
            setNameError('Name is required');
            return;
        } 
        if (!email) {
            setEmailError('Email is required');
            return;
        }
        if (!password) {
            setPasswordError('Password is required');
            return;
        }
        axios.post('/api/register', {name, email, password})
        .then(result => {
            if (result.data.success) {
                navigate('/login');
            } else if (result.data.error === 'Email is already registered') {
                setEmailError('Email is already registered');
            } 

        })
        .catch(error => console.log(error));
    };
    return (
        <>
        <section className="gradient-custom">
        <MyNavbar/>
        <div className="container py-3 login-container">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-6 col-sm-10">
                    <div className="card bg-body text-dark shadow-lg" style={{borderRadius: "1rem"}}>
                        <div className="card-body ps-5 pe-5 pb-5">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-md-5 mt-md-4">
                                <h2 className="fw-bold mb-2 p-5 text-uppercase text-center">Sign Up</h2>
                                <div className="form-outline form-white mb-4">
                                    <label className="form-label">Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        onChange={(e) => {
                                            setName(e.target.value)
                                            if (e.target.value === '') {
                                                setNameError("Name is required")
                                            } else {
                                                setNameError('')
                                            }
                                        }}
                                    />
                                    <div className="invalid-name" style={{color: "red", fontSize:"12px", padding: "5px"}}>
										{nameError}	
									</div>
                                </div>
                                <div className="mb-4">
									<label className="mb-2" htmlFor="email">E-Mail Address</label>
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
                                <div className="form-outline form-white mb-5">
                                    <label className="form-label" htmlFor="typePasswordX">Password</label>
                                    <input 
                                        type="password"
                                        className="form-control"
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (e.target.value.length < 6) {
                                                setPasswordError("Password should be at least 6 characters long")
                                            } else {
                                                setPasswordError('')
                                            }
                                        }}
                                    />
                                    <div className="invalid-password" style={{color: "red", fontSize:"12px", padding: "5px"}}>
								    	{passwordError}
							    	</div>
                                </div>
                                <button 
                                    className="btn btn-outline-dark btn-lg" 
                                    type="submit"
                                > 
                                    Create your account
                                </button>         
                            </div>
                            </form>
                            <div>
                                <p className="mb-0 text-black-50 text-center">
                                    Already have an account? 
                                    <Link className="nav-link text-black-50 fw-bold" 
                                        to="/login">Login</Link>
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

export default Register;