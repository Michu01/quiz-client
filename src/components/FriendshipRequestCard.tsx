import { useCallback, useEffect, useState } from "react";
import FriendshipRequest from "../models/FriendshipRequest";
import User from "../models/User";
import avatarsService from "../services/AvatarsService";
import friendshipRequestsService from "../services/FriendshipRequestsService";
import usersService from "../services/UsersService";

const FriendshipRequestCard = ({ friendshipRequest, remove }: { friendshipRequest: FriendshipRequest, remove: () => void }) => {
    const [user, setUser] = useState<User | null>(null);
    const [myId, setMyId] = useState<number | null>(null);
    const [avatarPath, setAvatarPath] = useState<string>('defaultAvatar.png');

    const fetchMyId = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.getMe(signal);
            if (response.success) {
                setMyId(response.user!.id);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    const fetchUser = useCallback(async (signal: AbortSignal) => {
        try {
            const id = friendshipRequest.senderId === myId ? friendshipRequest.receiverId : friendshipRequest.senderId; 

            const response = await usersService.find(id, signal);

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
    }, [friendshipRequest, myId]);

    const fetchAvatarPath = useCallback(async (signal: AbortSignal) => {
        try {
            const id = friendshipRequest.senderId === myId ? friendshipRequest.receiverId : friendshipRequest.senderId; 

            const response = await avatarsService.findPath(id, signal);

            if (response.success) {
                setAvatarPath(`https://localhost:7109/${response.path}?lastmod=${Date.now()}`);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [friendshipRequest, myId]);

    useEffect(() => {
        const controller = new AbortController();

        fetchUser(controller.signal);

        return () => controller.abort();
    }, [fetchUser]);

    useEffect(() => {
        const controller = new AbortController();

        fetchMyId(controller.signal);

        return () => controller.abort();
    }, [fetchMyId]);

    useEffect(() => {
        if (myId == null) {
            return;
        }

        const controller = new AbortController();

        fetchAvatarPath(controller.signal);

        return () => controller.abort();
    }, [myId, fetchAvatarPath]);

    async function cancel() {
        const response = await friendshipRequestsService.cancel(friendshipRequest.receiverId);
        if (response.success) {
            remove();
        } else {
            console.error(response.message);
        }
    } 

    async function decline() {
        const response = await friendshipRequestsService.decline(friendshipRequest.senderId);
        if (response.success) {
            remove();
        } else {
            console.error(response.message);
        }
    }

    async function accept() {
        const response = await friendshipRequestsService.accept(friendshipRequest.senderId);
        if (response.success) {
            remove();
        } else {
            console.error(response.message);
        }
    }

    return (
        <>
        {
            user != null &&
            <div className="d-flex flex-row bg-white align-items-center rounded m-1">
                <img className="m-1 rounded-circle object-fit-cover" height="60" width="60" alt="avatar" src={ avatarPath }/>
                <h4 className="m-1">{user.name}</h4>
                <div className="ml-auto">
                {
                    friendshipRequest.senderId === myId ?
                    <button className="btn btn-warning m-1" onClick={cancel}>Cancel</button> :
                    <>
                        <button className="btn btn-success m-1" onClick={accept}>Accept</button>
                        <button className="btn btn-danger m-1" onClick={decline}>Decline</button>
                    </>
                }
                </div>
            </div>
        }
        </>
    );
}

export default FriendshipRequestCard;