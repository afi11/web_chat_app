import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlApiMain } from "../../utils/url/";
import { Auth, history } from "../../config";
import { Link } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const [waiting, setWaiting] = useState(false);

  const [alert, setAlert] = useState({
    error: false,
    success: false,
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    document.title = "Halaman Login";
  }, []);

  const LoginUser = () => {
    setWaiting(true);
    axios
      .post(`${urlApiMain}login`, user)
      .then((res) => {
        setWaiting(false);
        const now = new Date();
        if (res.data.code == 1728) {
          setAlert({
            ...alert,
            ["error"]: true,
          });
          setErr(res.data.message);
        } else {
          Auth.setToken(
            res.data.token.original.token,
            res.data.id_user,
            now.getDate() + 1,
            now.getMonth()
          );
          history.push("/");
          window.location.reload();
        }
      })
      .catch(() => {
        setErr("Periksa email dan password anda!");
        setAlert({
          ...alert,
          ["error"]: true,
        });
        setWaiting(false);
      });
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h5 className="font-semibold text-2xl mb-3 text-blue-900">
          <i className="fas fa-envelope-open-text"></i> Instant Message!{" "}
        </h5>
        <div className="w-1/2 md:w-1/3 h-72">
          <div className="bg-white px-8 pt-6 pb-8 mb-4 rounded overflow-hidden shadow-lg">
            {alert.error ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                role="alert"
              >
                <p className="font-bold">Login Gagal!</p>
                <p>{err}</p>
              </div>
            ) : (
              <></>
            )}
            <div className="mb-4">
              <label className="bloc text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => onInputChange(e)}
                placeholder="example@example.net"
              />
            </div>
            <div className="mb-6">
              <label className="bloc text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                onChange={(e) => onInputChange(e)}
                placeholder="********"
              />
            </div>
            <div className="flex flex-row flex-1 justify-between">
              <div className="w-full">
                {waiting ? (
                  <button
                    className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline focus:shadow-outline"
                    type="button"
                  >
                    <i className="animate-spin fas fa-circle-notch mr-1"></i>
                    Processing....
                  </button>
                ) : (
                  <button
                    onClick={LoginUser}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline focus:shadow-outline flex-1"
                    type="button"
                  >
                    Masuk
                  </button>
                )}
              </div>
              <div className="w-full text-right text-sm">
                Belum punya akun silahkan mendaftar{" "}
                <Link className="text-blue-500" to="/register">
                  disini
                </Link>
              </div>
            </div>
            <div className="mt-3 text-sm">
              Lupa kata sandi silahkan buka{" "}
              <Link className="text-blue-500" to="/reset_password">
                Reset Password
              </Link>
            </div>
            <div className="text-center mt-5 border-t border-gray-500">
              <h5 className="text-gray-700 mt-3">
                &copy;2021 | fatakhulafi11@gmail.com
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
