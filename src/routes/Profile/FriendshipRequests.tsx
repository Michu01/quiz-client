import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendshipRequestCard from "../../components/FriendshipRequestCard";
import RouteTemplate from "../../components/RouteTemplate";
import FriendshipRequest from "../../models/FriendshipRequest";
import authService from "../../services/AuthService";
import friendshipRequestsService from "../../services/FriendshipRequestsService";

const FriendshipRequests = () => {
    const isSignedIn = authService.isSignedIn();

    const [friendshipRequests, setFriendshipRequests] = useState<FriendshipRequest[] | null>(null);

    const navigate = useNavigate();

    const fetchFriendshipRequests = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await friendshipRequestsService.get(signal);
            if (response.success) {
                setFriendshipRequests(response.friendshipRequests);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, []);

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        const controller = new AbortController();

        fetchFriendshipRequests(controller.signal);

        return () => controller.abort();
    }, [isSignedIn, fetchFriendshipRequests]);

    useEffect(() => {
        if (!isSignedIn) {
            navigate("/auth/signIn");
        }
    }, [isSignedIn, navigate]);

    return (
        <RouteTemplate>
            <div className="container">
                <div className="row">
                    <div className="col-3"/>
                    <div className="col-6">
                        { friendshipRequests != null && friendshipRequests.map(fr => <FriendshipRequestCard key={ (fr.receiverId, fr.senderId) } friendshipRequest={fr}/>) }
                    </div>
                    <div className="col-3"/>
                </div>
            </div>
        </RouteTemplate>
    );
}

export default FriendshipRequests;