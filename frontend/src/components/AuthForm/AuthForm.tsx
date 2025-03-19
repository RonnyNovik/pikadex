import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg?react";
import { Button, Input, Card } from "../ui";
import { useAuth } from "../../hooks";
import styles from "./AuthForm.module.css";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { onLogin } = useAuth();
    const navigate = useNavigate();

    const switchButtonHandler = () => {
        setIsLogin(!isLogin);
    }
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const requestEndpoint = isLogin ? 'login' : 'register';
            const response = await fetch(`http://localhost:3000/auth/${requestEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            onLogin(data.accessToken);
            navigate('/');
        } catch (error) {
            const requestEndpoint = isLogin ? 'login' : 'register';
            const errorMessage = `An error occurred while trying to ${requestEndpoint}, please check your connection and try again.`;
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }


    const submitButtonText = isLogin ? "Login" : "Register";
    const switchButtonText = isLogin ? "Switch to Register" : "Switch to Login";
    const errorMessageElement = error ? <p className={styles.errorText}>{error}</p> : null;

    return (
        <Card className={styles.formContainer}>
            <Logo className={styles.logo} />
            <Input label="User name" type="text" description="Should be at least 3 characters" value={username} onChange={handleUsernameChange} />
            <Input label="Password" type="password" description="Should be at least 8 characters with one uppercase and one lowercase letter" value={password} onChange={handlePasswordChange} />
            <Button onClick={handleSubmit} isLoading={isLoading}>{submitButtonText}</Button>
            <Button disabled={isLoading} variant="secondary" onClick={switchButtonHandler}>{switchButtonText}</Button>
            {errorMessageElement}
        </Card>
    );
};

export default AuthForm;