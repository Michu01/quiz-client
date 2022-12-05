import { useState, useCallback, useEffect } from "react";
import friendshipRequestsService from "../services/FriendshipRequestsService";
import friendsService from "../services/FriendsService";
import usersService from "../services/UsersService";

const FriendInviteButton = ({ userId, className }: { userId: number, className?: string }) => {
    const [isFriend, setIsFriend] = useState<boolean | null>(null);
    const [isInvited, setIsInvited] = useState<boolean | null>(null);

    const fetchIsFriend = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.isFriend(userId, signal);
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
    }, [userId]);

    const fetchIsInvited = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.isInvited(userId, signal);
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
    }, [userId]);

    useEffect(() => {
        const controller = new AbortController();

        fetchIsFriend(controller.signal);

        return () => controller.abort();
    }, [fetchIsFriend]);

    useEffect(() => {
        const controller = new AbortController();

        fetchIsInvited(controller.signal);

        return () => controller.abort();
    }, [fetchIsInvited]);

    async function unfriend() {
        const response = await friendsService.delete(userId);
        if (response.success) {
            setIsFriend(false);
        } else {
            console.error(response.message);
        }
    }

    async function addFriend() {
        const response = await friendshipRequestsService.send(userId);
        if (response.success) {
            setIsInvited(true);
        } else {
            console.error(response.message);
        }
    }

    async function cancelInvitation() {
        const response = await friendshipRequestsService.cancel(userId);
        if (response.success) {
            setIsInvited(false);
        } else {
            console.error(response.message);
        }
    }

    return (
        <>
        {
            isFriend != null && isInvited != null &&
            <>
            {
                isFriend && <button className={ className + " btn btn-danger"} onClick={unfriend}>Unfriend</button>
            }
            {
                !isFriend && !isInvited && <button className={ className + " btn btn-success"} onClick={addFriend}>Add friend</button>
            }
            {
                !isFriend && isInvited && <button className={ className + " btn btn-warning"} onClick={cancelInvitation}>Cancel invitation</button>
            }
            </>
        }
        </>
    )
}

export default FriendInviteButton;