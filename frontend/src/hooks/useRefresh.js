import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefresh = () => {

    const {setUser} = useAuth();
    const refresh = async () => {
        try {
            const res = await axios.get("/refresh", { withCredentials: true });
            setUser(prev =>{
                console.log(JSON.stringify(prev));
                console.log(res.data.token);

                return {
                    ...prev,
                    role: res.data.role,
                    token: res.data.token,
                    userId: res.data.userId
                }
            }        
        );

        return res.data.token;

        } catch (err) {
            console.log(err);
        }
    }
  return refresh;
}

export default useRefresh