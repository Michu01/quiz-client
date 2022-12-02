import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import FriendInviteButton from "../../components/FriendInviteButton";
import RouteTemplate from "../../components/RouteTemplate";
import VerticallyCenteredContainer from "../../components/VerticallyCenteredContainer";
import User from "../../models/User";
import authService from "../../services/AuthService";
import avatarsService from "../../services/AvatarsService";
import usersService from "../../services/UsersService";

const UserDetails = () => {
    const params = useParams();

    const id = Number.parseInt(params.id ?? '');

    const [avatarPath, setAvatarPath] = useState<string>('defaultAvatar.png');
    const [user, setUser] = useState<User | null>(null);
    const [isMe, setIsMe] = useState<boolean | null>(null);

    const navigate = useNavigate();

    const fetchIsMe = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.getMe(signal);
            if (response.success) {
                setIsMe(response.user!.id === id);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [id]);

    const fetchUser = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.find(id, signal);
            if (response.success) {
                setUser(response.user);
            } else {
                console.error(response.message);
                navigate("/users");
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [id, navigate]);

    const fetchAvatarPath = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await avatarsService.findPath(id, signal);

            if (response.success) {
                setAvatarPath(`https://localhost:7109/${response.path}?lastmod=${Date.now()}`);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();

        fetchUser(controller.signal);

        return () => controller.abort();
    }, [fetchUser]);

    useEffect(() => {
        const controller = new AbortController();

        fetchAvatarPath(controller.signal);

        return () => controller.abort();
    }, [fetchAvatarPath]);

    useEffect(() => {
        if (!authService.isSignedIn()) {
            return;
        }

        const controller = new AbortController();

        fetchIsMe(controller.signal);

        return () => controller.abort();
    }, [fetchIsMe]);

    useEffect(() => {
        if (isMe != null && isMe) {
            navigate("/profile");
        }
    }, [isMe, navigate]);

    return (
        <RouteTemplate>
            <VerticallyCenteredContainer>
                <div className="d-flex flex-row">
                    <div className="col-2"/>
                    <div className="col-8 d-flex flex-column align-items-center rounded p-3 opaque-white">
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
                                <Link className="btn btn-primary m-1" to={ `/quizes?creatorId=${id}` }>Quizes</Link>
                                { isMe != null && authService.isSignedIn() && <FriendInviteButton className="m-1" userId={id}/> }
                            </div>
                        </>
                    }
                    </div>
                    <div className="col-2"/>
                </div>
            </VerticallyCenteredContainer>
        </RouteTemplate>
    );
}

export default UserDetails;