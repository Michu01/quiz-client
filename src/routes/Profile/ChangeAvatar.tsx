import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CenteredContainer from "../../components/CenteredContainer";
import RouteTemplate from "../../components/RouteTemplate";
import authService from "../../services/AuthService";
import avatarsService from "../../services/AvatarsService";

const ProfileChangeAvatar = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const file = event.currentTarget.avatar.files[0];

        const response = await avatarsService.change(file);

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
                    <div className="form-group">
                        <input className="col form-control" title="Avatar" name="avatar" type="file" required/>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Change avatar</button>
                    </div>
                </form>
            </CenteredContainer>
        </RouteTemplate>
    );
}

export default ProfileChangeAvatar;