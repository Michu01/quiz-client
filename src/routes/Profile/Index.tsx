import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RouteTemplate from "../../components/RouteTemplate";
import VerticallyCenteredContainer from "../../components/VerticallyCenteredContainer";
import User from "../../models/User";
import authService from "../../services/AuthService";
import avatarsService from "../../services/AvatarsService";
import usersService from "../../services/UsersService";

const ProfileIndex = () => {
    const isSignedIn = authService.isSignedIn();

    const [avatarPath, setAvatarPath] = useState<string>("/defaultAvatar.png");
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const fetchMe = useCallback(async (signal: AbortSignal) => {
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

            if (response.success) {
                setAvatarPath(`https://localhost:7109/${response.path}?lastmod=${Date.now()}`);
            }
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

        fetchMe(controller.signal);

        return () => controller.abort();
    }, [isSignedIn, fetchMe]);

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
            <VerticallyCenteredContainer>
                <div className="min-w-75 min-h-50 d-flex flex-column justify-content-center align-items-center opaque-white">
                {
                    user != null &&
                    <>
                        <div className="m-1">
                            <img height="240" alt="avatar" src={ avatarPath }/>
                        </div>
                        <h4 className="m-1">{user.name}</h4>
                        <div className="row m-1">
                            <p className="col text-left my-auto">Join date:</p>
                            <p className="col text-right my-auto">{user.joinDate.toString()}</p>
                        </div>
                        <div className="row justify-content-center m-1">
                            <Link className="btn btn-primary m-1" to="/profile/changeAvatar">Change avatar</Link>
                            <Link className="btn btn-primary m-1" to="/profile/changePassword">Change password</Link>
                            <Link className="btn btn-primary m-1" to="/profile/changeUsername">Change username</Link>
                        </div>
                    </>
                }
                </div>
            </VerticallyCenteredContainer>
        </RouteTemplate>
    );
}

export default ProfileIndex;