import axios from "axios"
import authHeader from "./authHeader";

const API_URL = "http://localhost:8080/auth/"

class AuthService {
    static login(username, password){
        return axios
            .post(API_URL + "signin",{
                username,
                password
            })
            .then(response => {
                if(response.data.accessToken){
                    localStorage.setItem("user", JSON.stringify(response.data))
                }
                return response.data
            })
    }

    static logout(){
        localStorage.removeItem("user")
    }

    static register(username, email, password){
        return axios.post(API_URL + "signup",{
            username,
            email,
            password
        })
    }

    static getCurrentUser(){
        return JSON.parse(localStorage.getItem("user"))
    }

    static async validate(){
        return axios.get(API_URL + "check",{headers: authHeader()});
    }
}

export default AuthService