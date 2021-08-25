import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlApiMain } from "../../utils/url/";
import { Link } from "react-router-dom";

const Register = () => {
  const [alert, setAlert] = useState({
    error: false,
    success: false,
  });
  const [waiting, setWaiting] = useState(false);
  const [err, setErr] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const RegisterUser = () => {
    setWaiting(true);
    if (user.password === user.password_confirmation) {
      axios
        .post(`${urlApiMain}register`, user)
        .then((res) => {
          setAlert({
            ...alert,
            ["success"]: true,
          });
          setWaiting(false);
        })
        .catch((err) => {
          setErr(err.message);
          setAlert({
            ...alert,
            ["error"]: true,
          });
          setWaiting(false);
        });
    } else {
      setErr("Password konfirmasi tidak sama.");
      setAlert({
        ...alert,
        ["error"]: true,
      });
      setWaiting(false);
    }
  };

  useEffect(() => {
    document.title = "Halaman Register";
  }, []);

  return (
    <div className="relative mt-12 h-64">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h5 className="font-semibold text-2xl mb-3 text-blue-900">
          <i className="fas fa-envelope-open-text"></i> Instant Message!{" "}
        </h5>
        <div className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 h-64">
          <div className="bg-white px-8 pt-6 pb-8 mb-4 rounded overflow-hidden shadow-lg">
            {alert.success ? (
              <div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
                role="alert"
              >
                <p className="font-bold">Register Berhasil</p>
                <p>Periksa alamat email anda lakukan verifikasi agar akun anda dapat digunakan!</p>
              </div>
            ) : (
              <></>
            )}
            {alert.error ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                role="alert"
              >
                <p className="font-bold">Register Akun Gagal</p>
                <p>{err}</p>
              </div>
            ) : (
              <></>
            )}
            <div className="mb-4">
              <label className="bloc text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => onInputChange(e)}
                placeholder="Ronaldo"
              />
            </div>
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
            <div className="mb-6">
              <label className="bloc text-gray-700 text-sm font-bold mb-2">
                Repeat Password
              </label>
              <input
                type="password"
                name="password_confirmation"
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
                    onClick={RegisterUser}
                    className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline focus:shadow-outline"
                    type="button"
                  >
                    Mendaftar
                  </button>
                )}
              </div>
              <div className="w-full text-right text-sm">
                Sudah punya akun silahkan login{" "}
                <Link className="text-blue-500" to="/login">
                  disini
                </Link>
              </div>
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

export default Register;
