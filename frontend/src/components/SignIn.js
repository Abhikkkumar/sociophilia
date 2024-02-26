import React,{useState,useContext} from 'react';
import "../css/signin.css";
import logo_1 from "../img/logo-2.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoginContext } from '../contexts/LoginContext';
import Footer from "../components/Footer";

const SignIn = () => {
  const {setUserLogin} = useContext(LoginContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const navigate = useNavigate();

  async function postData() {
    try {
      const response = await axios.post("/signin/", {
        email,
        password
      });
      // console.log(response.data);
      localStorage.setItem("jwt",response.data.token);
      localStorage.setItem("user",JSON.stringify(response.data.savedUser));
      setUserLogin(true);
      notifySuccess(response.data.message);
      navigate("/");//moving to HOME page after successful signin.
    } catch (error) {
      notifyError(error.response.data.error);
    }
  }

  return (
    <div className="s-createPost" >
    <div className='signIn'>
      <div>
        <div className='loginForm'>
          {/* <img className='signUpLogo' src={logo} alt='insta-logo' /> */}
          <div className="logo-div" style={{padding:"0px", marginBottom:"5px"}}>
            <img
              className="insta-logo insta-logo-1"
              src={logo_1}
              alt="logo"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
            />
          </div>
          <div>
          <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
            />
          </div>
          <input type='submit' value={"Sign In"} id='login-btn' onClick={()=>{
            postData();
          }} />
        </div>
        <div className="loginForm2">
          Don't have an account?
          <Link to='/signup'>
          <span style={{color:"blue", cursor:"pointer"}}>Sign Up</span>
          </Link>
          
        </div>
      </div>
    </div>
    <Footer />
    </div>
  )
}

export default SignIn
