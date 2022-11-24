import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CenteredContainer from "../../components/CenteredContainer";
import RouteTemplate from "../../components/RouteTemplate";
import User from "../../models/User";
import authService from "../../services/AuthService";
import avatarsService from "../../services/AvatarsService";
import usersService from "../../services/UsersService";

const ProfileIndex = () => {
    const isSignedIn = authService.isSignedIn();

    const [avatarPath, setAvatarPath] = useState<string | null>('defaultAvatar.png');
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const getMe = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.getMe(signal);
            if (response.success) {
                setUser(response.user);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    const fetchAvatarPath = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await avatarsService.getPath(signal);

            const path = response.success ? response.path : 'defaultAvatar.png';

            setAvatarPath(path);
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    useEffect(() => {
        if (!isSignedIn) {
            navigate("/auth/signIn");
        }
    }, [isSignedIn, navigate]);

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        const controller = new AbortController();

        getMe(controller.signal);

        return () => controller.abort();
    }, [isSignedIn, getMe, navigate]);

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        const controller = new AbortController();

        fetchAvatarPath(controller.signal);

        return () => controller.abort();
    }, [isSignedIn, fetchAvatarPath]);

    return (
        <RouteTemplate>
            <CenteredContainer>
            {
                user != null &&
                <>
                    <img className="row align-self-center" height="240" alt="avatar" src={ avatarPath == null ? "" : `https://localhost:7109/${avatarPath}?lastmod=${Date.now()}`}/>
                    <h4 className="row align-self-center">{user.name}</h4>
                    <div className="row">
                        <p className="col text-left">Join date:</p>
                        <p className="col text-right">{user.joinDate.toString()}</p>
                    </div>
                    <div className="row justify-content-center">
                    <Link to="/profile/changeAvatar">Change avatar</Link>
                    </div>
                    <div className="row justify-content-center">
                        <Link to="/profile/changePassword">Change password</Link>
                    </div>
                </>
            }
            </CenteredContainer>
        </RouteTemplate>
    );
}

export default ProfileIndex;