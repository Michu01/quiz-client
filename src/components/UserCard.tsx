import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import User from "../models/User";
import authService from "../services/AuthService";
import avatarsService from "../services/AvatarsService";
import FriendInviteButton from "./FriendInviteButton";

const UserCard = ({ user, isMe }: { user: User, isMe: boolean }) => {
    const [avatarPath, setAvatarPath] = useState("/defaultAvatar.png");
    
    const fetchAvatarPath = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await avatarsService.findPath(user.id, signal);
            if (response.success) {
                setAvatarPath(`https://localhost:7109/${response.path}?lastmod=${Date.now()}`);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [user.id]);

    useEffect(() => {
        const controller = new AbortController();

        fetchAvatarPath(controller.signal);

        return () => controller.abort();
    }, [fetchAvatarPath]);

    return (
        <div className="user-card card m-3 justify-content-center">
            <div className="image">
                <img alt="avatar" src={ avatarPath }/>
            </div>
            <div className="card-body px-3 py-2">
                <div className="row justify-content-center">
                    <h5>{ user.name }</h5>
                </div>
                <div className="row justify-content-center">
                    <Link className="btn btn-primary m-1" to={ isMe ? '/profile' : `/users/${user.id}` }>Profile</Link>
                    <Link className="btn btn-primary m-1" to={ `/quizes?creatorId=${user.id}` }>Quizes</Link>
                    { !isMe && authService.isSignedIn() && <FriendInviteButton className="m-1" userId={user.id}/> }
                </div>
            </div>
        </div>
    );
}

export default UserCard;