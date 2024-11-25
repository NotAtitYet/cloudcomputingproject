import axios from 'axios';
import React, { useState } from 'react';
import "./register.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    // State variables for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate that passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setSuccessMessage('');

        // Prepare form data
        const formData = {
            name,
            email,
            password,
            phone,
        };

        try {
            // Send a POST request to the backend
            const response = await axios.post("http://localhost:8080/api/v1/auth/register", formData);
            console.log(response);
            // Handle successful registration
            const { user, userName, token } = response.data;
            console.log(user._id);
            console.log(token);
            localStorage.setItem("userId", user._id);
            localStorage.setItem("userName", userName);
            localStorage.setItem("token", token);
            setSuccessMessage(response.data.message || 'Registration successful!');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setPhone('');
            // navigate("/home");
        } catch (error) {
            // Handle errors
            setError(error.response?.data?.message || 'An error occurred during registration.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <label htmlFor="phone">Phone:</label>
                <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}
                {/* {successMessage && <p className="success">{successMessage}</p>} */}

                <button type="submit">Register</button>
            </form>
            <p className="message">
                Already have an account?
                <Link to="/login"> Login here </Link>
            </p>
        </div>
    );
}

export default Register;
