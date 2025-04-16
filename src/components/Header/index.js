import React, { useEffect } from 'react';
import "./styles.css";
import { auth } from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import userImg from "../../assets/user.svg"




function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  function logoutfnc() {
    try {
      signOut(auth).then(() => {
        toast.success("Logged out Successfully!")
        navigate("/dashboard");
      }).catch((error) => {
        toast.error(error.message);
      });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="navbar">
      <p className='logo'>Expenses</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src={user?.photoURL || userImg}
            style={{ borderRadius: "50%", height: "2rem", width: "2rem" }}
            alt="User profile"
          />
          <p className='logo link' onClick={logoutfnc}>logout</p>
        </div>
      )}
    </div>
  )
}

export default Header

