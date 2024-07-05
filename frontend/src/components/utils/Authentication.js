import axios from './axiosInterceptor';



const sendUserLogRequest = async (data) => {
  const API_URL = process.env.REACT_APP_API_URL;

    try {
        const response = await axios.post(`${API_URL}/login`, {
            email: data.email,
            password: data.password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


const handleSignup = async(input)=>{
  const API_URL = process.env.REACT_APP_API_URL;

    try{
        const response = await axios.post(`${API_URL}/signup`,{
            name:input.name,
            email:input.email,
            password:input.password
        })
        return response.data
    }catch(error){
        throw error
    }
}

export {sendUserLogRequest, handleSignup};
