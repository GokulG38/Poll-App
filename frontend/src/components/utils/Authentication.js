import axios from './axiosInterceptor';



const sendUserLogRequest = async (data) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            email: data.email,
            password: data.password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


const handleSignup = async(input)=>{
    try{
        const response = await axios.post("http://www.localhost:5000/signup",{
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
