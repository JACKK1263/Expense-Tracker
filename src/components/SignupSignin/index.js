import React, { useState } from 'react'
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, provider } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function SignupSigninCom() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loginFrom, setLoginFrom] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmpassword", confirmPassword);

    if (name !== "" && email !== "" && password !== "" && confirmPassword !== "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {

            const user = userCredential.user;
            console.log("User>>>", user);
            toast.success("User Created!");
            setName("");
            setEmail("");
            setPassword("");
            setconfirmPassword("");
            setLoading(false);
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorCode);
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("password and confirmpassword don't match!");
      }

    } else {
      toast.error("All fiels are mandatory!");
      setLoading(false);
    }
  }
  function loginUsingEmail() {
    console.log("email", email);
    console.log("password", password);
    setLoading(true);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

          const user = userCredential.user;
          toast.success("User Logged in!");
          console.log("User Logged In", user);
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("All fiels are mandatory!");
      setLoading(false);
    }
  }
  async function createDoc(user) {
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "user", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc Created!");
      } catch (e) {
        toast.error(e.message)
        setLoading(false);
      }
    }
    else {
      toast.error("Doc already exists");
      setLoading(false);
    }
  }
  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          toast.success("User Authenticated!")
          console.log("User>>>", user);
          createDoc(user);
          setLoading(false);
          navigate("/dashboard");
        }).catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
        });
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  }

  return (
    <>
      {loginFrom ? (
        <div className='signup-wrapper'>
          <h2 className='title'>Login on <span style={{ color: "var(--theme)" }}>Expenses Tracker</span></h2>
          <form>
            <Input
              type="email"
              lable={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johnydeep@gmail.com"}
            />
            <Input
              type="password"
              lable={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"johnydeep@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "loading..." : "Login Using Email and Password"} onClick={loginUsingEmail} />
            <p style={{ textAlign: "center", color: "gray" }}>or</p>
            <Button onClick={googleAuth}
              text={loading ? "loading..." : "Login Using Google"} blue={true} />
            <p style={{ textAlign: "center", color: "gray", fontSize: "0.9rem", cursor: "pointer" }}
              onClick={() => setLoginFrom(!loginFrom)}>Or Don't Have An Account ? Click Here </p>
          </form>
        </div>
      ) : (
        <div className='signup-wrapper'>
          <h2 className='title'>Login on <span style={{ color: "var(--theme)" }}>Expenses Tracker</span></h2>
          <form>
            <Input
              lable={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"johny deep"}
            />
            <Input
              type="email"
              lable={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johnydeep@gmail.com"}
            />
            <Input
              type="password"
              lable={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"johnydeep@123"}
            />
            <Input
              type="password"
              lable={"ConfirmPassword"}
              state={confirmPassword}
              setState={setconfirmPassword}
              placeholder={"johnydeep@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "loading..." : "Signup Using Email and Password"} onClick={signupWithEmail} />
            <p style={{ textAlign: "center", color: "gray" }}>or</p>
            <Button onClick={googleAuth}
              text={loading ? "loading..." : "Signup Using Google"} blue={true} />
            <p style={{ textAlign: "center", color: "gray", fontSize: "0.9rem", cursor: "pointer" }}
              onClick={() => setLoginFrom(!loginFrom)}>Or Have An Account Already? Click Here </p>
          </form>
        </div>
      )
      }
    </>

  );
}

export default SignupSigninCom