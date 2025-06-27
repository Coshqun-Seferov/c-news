"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import config from "../../../config.js";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }
                const res = await fetch(`${config.api}auth/profile/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUser();
    }, [router]);

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!user) {
        return <div className="text-center">Loading...</div>;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        router.push("/login");
    }

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const res = await fetch(`${config.api}auth/profile/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            router.push("/register");
        } else {
            setError("Failed to delete account");
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const handleChangePicture = async () => {
            if (!profilePicture) return;
            const formData = new FormData();
            formData.append("profile_picture", profilePicture);
            const res = await fetch(`${config.api}auth/profile/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });
            if (!res.ok) {
                throw new Error("Failed to update profile picture");
            }
        };
        const handleResetPassword = async () => {
            if (!password) return;
            const res = await fetch(`${config.api}auth/password-reset/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ password }),
            });
            if (!res.ok) {
                throw new Error("Failed to reset password");
            }
        };
        
        const handleChangePassword = async () => {
            if (!password) return;
            const res = await fetch(`${config.api}auth/change-password/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ password }),
            });
            if (!res.ok) {
                throw new Error("Failed to change password");
            }
        };
        const handleChangeUsername = async () => {
            if (!username) return;
            const res = await fetch(`${config.api}auth/profile/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ username }),
            });
            if (!res.ok) {
                throw new Error("Failed to change username");
            }
        };
        const handleChangeEmail = async () => {
            if (!email) return;
            const res = await fetch(`${config.api}auth/profile/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                throw new Error("Failed to change email");
            }
        };
        try {
            await handleChangePicture();
            await handleResetPassword();
            await handleChangePassword();
            await handleChangeUsername();
            await handleChangeEmail();
            setUser({ ...user, username, email, bio });
        } catch (err) {
            setError(err.message);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="flex items-center justify-between mb-4">
                        <img
                            src={user.profile_picture || "/default-profile.png"}
                            alt="Profile"
                            className="w-16 h-16 rounded-full mb-4"
                        />
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-red-500 hover:underline"
                        >
                            Logout
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="text-red-500 hover:underline"
                        >
                            Delete Account
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username || user.username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email || user.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <textarea
                            placeholder="Bio"
                            value={bio || user.bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="file"
                            onChange={(e) => setProfilePicture(e.target.files[0])}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}