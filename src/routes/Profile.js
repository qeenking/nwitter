import React, { useEffect, useState } from "react";
import { authService, dbService } from "myBase";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            });
            refreshUser();
        }
    };
    const getMyNweets = async () => {
        const nweets = await dbService
            .collection("nweets")
            .where("createrId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
    }
    useEffect(() => {
        getMyNweets();
    }, [])
    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName} />
                <input type="submit" value="Upadte Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};