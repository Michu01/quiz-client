import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import User from "../models/User";
import avatarsService from "../services/AvatarsService";
import friendshipRequestsService from "../services/FriendshipRequestsService";
import friendsService from "../services/FriendsService";
import usersService from "../services/UsersService";

const UserCard = ({ user, isMe }: { user: User, isMe: boolean }) => {
    const [avatarPath, setAvatarPath] = useState("defaultAvatar.png");
    const [isFriend, setIsFriend] = useState<boolean | null>(null);
    const [isInvited, setIsInvited] = useState<boolean | null>(null);

    const fetchIsFriend = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.isFriend(user.id, signal);
            if (response.success) {
                setIsFriend(response.isFriend);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [user.id]);

    const fetchIsInvited = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.isInvited(user.id, signal);
            if (response.success) {
                setIsInvited(response.isInvited);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [user.id]);

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

    useEffect(() => {
        if (isMe) {
            return;
        }

        const controller = new AbortController();

        fetchIsFriend(controller.signal);

        return () => controller.abort();
    }, [isMe, fetchIsFriend]);

    useEffect(() => {
        if (isMe) {
            return;
        }

        const controller = new AbortController();

        fetchIsInvited(controller.signal);

        return () => controller.abort();
    }, [isMe, fetchIsInvited]);

    async function unfriend() {
        const response = await friendsService.delete(user.id);
        if (response.success) {
            setIsFriend(false);
        } else {
            console.error(response.message);
        }
    }

    async function addFriend() {
        const response = await friendshipRequestsService.send(user.id);
        if (response.success) {
            setIsInvited(true);
        } else {
            console.error(response.message);
        }
    }

    async function cancelInvitation() {
        const response = await friendshipRequestsService.cancel(user.id);
        if (response.success) {
            setIsInvited(false);
        } else {
            console.error(response.message);
        }
    }

    return (
        <div className="user-card card m-2 p-1 justify-content-center">
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
                </div>
                <div className="row justify-content-center">
                {
                    !isMe &&
                    <>
                    {
                        isFriend && <button className="btn btn-danger m-1" onClick={unfriend}>Unfriend</button>
                    }
                    {
                        !isFriend && !isInvited && <button className="btn btn-success m-1" onClick={addFriend}>Add friend</button>
                    }
                    {
                        !isFriend && isInvited && <button className="btn btn-warning m-1" onClick={cancelInvitation}>Cancel invitation</button>
                    }
                    </>
                }
                </div>
            </div>
        </div>
    );
}

export default UserCard;