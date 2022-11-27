import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredContainer from "../../components/CenteredContainer";
import RouteTemplate from "../../components/RouteTemplate";
import authService from "../../services/AuthService";

const ProfileChangePassword = () => {
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const currentPassword = event.currentTarget.currentPassword.value;
        const newPassword = event.currentTarget.newPassword.value;
        const response = await authService.changePassword(currentPassword, newPassword);
        if (response.success) {
            navigate("/profile");
        } else {
            setError(response.message);
        }
    }

    useEffect(() => {
        if (!authService.isSignedIn()) {
            navigate("/auth/signIn");
        }
    }, [navigate]);

    return (
        <RouteTemplate>
            <CenteredContainer>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="form-group text-center">
                        <span className="form-text text-danger">{error}</span>
                    </div>
                    <div className="form-group row">
                        <label className="col col-form-label text-left" htmlFor="currentPassword">Current password</label>
                        <input className="col form-control" title="current password" name="currentPassword" type="password" required></input>
                    </div>
                    <div className="form-group row">
                        <label className="col col-form-label text-left" htmlFor="newPassword">New password</label>
                        <input className="col form-control" title="new password" name="newPassword" type="password" required></input>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Change password</button>
                    </div>
                </form>
            </CenteredContainer>
        </RouteTemplate>
    );
}

export default ProfileChangePassword;