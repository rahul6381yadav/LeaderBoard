import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Forget() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/user/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Password reset email sent successfully. Check your inbox.");
                setError(null);
                navigate('/VerifyOTP');
            } else {
                setError(result.message || "Something went wrong. Try again.");
                setMessage(null);
            }
            setEmail("");

        } catch (err) {
            setError("Failed to send password reset email. Try again later.");
            setMessage(null);
        }
    };

    return (
        <>
            <iframe
                src="./background.html" // Path to the HTML file in the public folder
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    border: "none",
                    zIndex: -1, // Ensures the background stays behind the content
                }}
                title="Background Design"
            />

            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-full max-w-md rounded-lg shadow-lg">
                    <div className="p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

                        <p className="text-sm text-gray-600 text-center">
                            Enter your email address to receive a password reset link.
                        </p>

                        {message && (
                            <div className="text-green-500 text-sm text-center">{message}</div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Send Reset Link
                            </button>
                        </form>

                        <div className="flex justify-center items-center mt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Forget;