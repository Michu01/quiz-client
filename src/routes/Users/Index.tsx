import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RouteTemplate from "../../components/RouteTemplate";
import UserCard from "../../components/UserCard";
import User from "../../models/User";
import authService from "../../services/AuthService";
import usersService from "../../services/UsersService";

const UserIndex = () => {
    const [searchParams] = useSearchParams();

    const namePattern = searchParams.get('namePattern');
    const friendsOnly = searchParams.get('friendsOnly') === "on";

    const [myId, setMyId] = useState<number | null>(null);
    const [users, setUsers] = useState([] as User[]);

    const userList = useMemo(() => users.map(user => <UserCard key={user.id} user={user} isMe={user.id === myId}/>), [users, myId]);

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

    const fetchUsers = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await usersService.get(namePattern, friendsOnly, signal);
            if (response.success) {
                setUsers(response.users);
            } else {
                console.error(response.message);
            }
        } catch (e) {
            if (e instanceof DOMException) {
                console.log(e.message);
            } else throw e;
        }
    }, [namePattern, friendsOnly]);

    useEffect(() => {
        if (!authService.isSignedIn()) {
            return;
        }

        const controller = new AbortController();

        fetchMyId(controller.signal);

        return () => controller.abort();
    }, [fetchMyId]);

    useEffect(() => {
        const controller = new AbortController();

        fetchUsers(controller.signal);

        return () => controller.abort();
    }, [fetchUsers]);

    return (
        <RouteTemplate>
            <div className="d-flex flex-row align-items-start">
                <div className="col-2 bg-white">
                    <form className="p-1">
                        <div className="form-group row">
                            <input className="form-control" type="search" name="namePattern" title="Name pattern" placeholder="Input user name..." defaultValue={namePattern ?? ''}/>
                        </div>
                        <div className="form-check row">
                            <input className="form-check-input" type="checkbox" name="friendsOnly" defaultChecked={friendsOnly}/>
                            <label className="form-check-label" htmlFor="friendsOnly">Friends only</label>
                        </div>
                        <div className="form-group row mb-0">
                            <button className="col btn btn-primary" type="submit">Search</button>
                        </div>
                    </form>
                </div>
                <div className="col-8 d-flex flex-row flex-wrap justify-content-center m-1">
                    { userList }
                </div>
                <div className="col-2"/>
            </div>
        </RouteTemplate>
    );
}

export default UserIndex;