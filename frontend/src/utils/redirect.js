import { getPersonById } from "../services/person-service";

export const redirectIfSessionExpired = (user, setUser, navigate) => {
    getPersonById(user.id)
        .catch(() => {
            setUser(null);
            navigate('/login');
        })
}

export const pendingRedirect = (navigate, to, delay = 1000) => {
    const timerId = setTimeout(() => {
        navigate(to);
    }, delay);

    return () => clearTimeout(timerId);
}