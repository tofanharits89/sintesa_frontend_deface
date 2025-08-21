import React, { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { el } from "date-fns/locale";

const DigitLogin = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [accessToken, setAccessToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const SSO_DIGIT_CLIENT_STATE = import.meta.env.VITE_SSO_DIGIT_CLIENT_STATE;
    const SSO_DIGIT_CLIENT_ID = import.meta.env.VITE_SSO_DIGIT_CLIENT_ID;
    const SSO_DIGIT_CLIENT_SECRET = import.meta.env.VITE_SSO_DIGIT_CLIENT_SECRET;
    const SSO_DIGIT_URL = import.meta.env.VITE_SSO_DIGIT_URL;
    const SSO_DIGIT_REDIRECT_URI = import.meta.env.VITE_SSO_DIGIT_REDIRECT_URI;

    const CheckUserData = async (nip) => {
        if(!nip) {
            return;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_LOCAL_CEK_USERS}?username=${nip}`, {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.exists) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error checking user data:", error);
            return;
        }
    }

    const CekDigitLogin = async () => {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        // if (state !== SSO_DIGIT_CLIENT_STATE) {
        //     <Navigate to={`/v3/auth/login`} replace />;
        // }

        console.log("Code:", code);
        console.log("State:", state);

        fetch(`${SSO_DIGIT_URL}/api/access-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "grant-type": "code",
                "code": code,
                "redirect_uri": SSO_DIGIT_REDIRECT_URI,
                "client_id": SSO_DIGIT_CLIENT_ID,
                "client_secret": SSO_DIGIT_CLIENT_SECRET
            })
        }).then((response) => {
            let responseData = response.json();
            if (responseData.code !== "00") {
                throw new Error('Network response was not ok');
            }
            setAccessToken(responseData.access_token);
            setUserId(responseData.user_id);
        }).catch((error) => {
            console.error("Error fetching access token:", error);
        })

        if (!accessToken || !userId) {
            return;
        } else {
            await fetch(`${SSO_DIGIT_URL}/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((response) => {
                let responseData = response.json();
                if (responseData.code !== "00") {
                    throw new Error('Network response was not ok');
                } else {
                    let userData = responseData.data;
                    if (userData) {
                        const {nama, nip, email, foto } = userData;
                        try {
                            let isUserExist = CheckUserData(nip);
                            if( isUserExist ) {
                                return <Navigate to={`/v3/dashboard`} replace />;
                            } else {
                                return <Navigate to={`/v3/auth/register?nama=${nama}&nip=${nip}&email=${email}&foto=${foto}`} replace />;
                            }
                        } catch (error) {
                            console.error("Error registering user:", error);
                        }
                    }
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            })
        }
    }

    useEffect(() => {
        CekDigitLogin();
    }, [location]);
}

export default DigitLogin;