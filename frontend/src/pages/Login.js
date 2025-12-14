import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import armyEmblem from "./sl-army-emblem-logo.png";
import "../globals.css"; 

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ userName: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        userName: form.userName.trim(),
        password: form.password.trim(),
      };

      const res = await API.post("/auth/login", payload);

      if (res.data?.token) {
        login(res.data.token);
        toast.success(`Welcome back, ${payload.userName}!`);
        redirectUser(payload.userName);
      } else {
        setError("Login failed. No token received.");
        toast.error("Login failed. No token received.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError("Invalid credentials");
      toast.error("Invalid credentials");
    }

    setIsLoading(false);
  };

  const redirectUser = (userName) => {
    if (userName === "SupAdmin") window.location.href = "/super-admin";
    else if (userName === "SysAdmin") window.location.href = "/system-admin";
    else if (userName.startsWith("EstbAlphaAdmin") || userName.startsWith("EstbBetaAdmin"))
      window.location.href = "/establishment-admin";
    else if (userName.startsWith("EstbAlphaHead") || userName.startsWith("EstbBetaHead"))
      window.location.href = "/establishment-head";
    else if (userName.startsWith("StdmbrAlpha") || userName.startsWith("StdmbrBeta"))
      window.location.href = "/standard-member";
    else toast.error("Unknown username!");
  };

  return (
    <div className="container" >
      <div className="card" >
        

        <div className="text-center mb-4">
          <img
            src={armyEmblem}
            alt="Sri Lanka Army Emblem"
            style={{ width: "120px", height: "120px", objectFit: "contain" }}
          />
          <h1 className="mb-0">Sri-Lanka Army</h1>
          <h2>Leave Management System</h2>
        </div>

         <div className="alert" >
          <AlertTriangle />
          <div className="alert-description" >
            <strong>SECURE NETWORK ACCESS ONLY</strong><br />
            Accessible only via SL Army Data Network (SLADN) or authorized VPN
          </div>
        </div>
        

        {/* Login Form  */}
        <form onSubmit={handleSubmit}>
          
          <div className="w-full flex flex-col items-start mt-2 text-left">
            <label htmlFor="userName" className="w-full text-left">
              Username
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              placeholder="Enter your username"
              value={form.userName}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>

          <div className="w-full flex flex-col items-start mt-1 text-left">
            <label htmlFor="password" className="w-full text-left">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </div>


          {error && <div className="alert">{error}</div>}


          
          <button type="submit" className="button mt-1" disabled={isLoading}>

            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center mt-1">Use your official credentials</p>

          <div className="footer mb-2"> 
          <br/>

          <p>© 2025 Sri Lanka Army</p>
          <p>Directorate of Information Technology</p>
        </div>
        </form>
        
      </div>
    </div>
  );
}