import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { urlApiMain } from "../../utils/url";

const RenewPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const resetPassword = () => {
    setLoading(true);
    const { password, re_password } = data;
    if (password === re_password) {
      axios.post(`${urlApiMain}reset_password`, data).then(() => {
        setError(false);
        setSuccess(true);
        setLoading(false);
        setMsg(
          "Berhasil melakukan reset password, silahkan login dengan email dan password baru anda!"
        );
      });
    } else {
      setSuccess(false);
      setError(true);
      setLoading(false);
      setMsg("Form password dan repeat password tidak sama!");
    }
  };

  useEffect(() => {
    setData({
      ...data,
      email: query.get("mail"),
    });
  }, []);

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 h-100">
          <h5 className="font-semibold text-2xl mb-3 text-blue-900 text-center">
            <i className="fas fa-envelope-open-text"></i> Instant Message!{" "}
          </h5>
          <div className="bg-white px-8 pt-6 pb-8 mb-4 rounded overflow-hidden shadow-lg">
            <h1 className="text-center font-medium text-xl text-gray-800">
              Reset Password Akun
            </h1>
            {error ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                role="alert"
              >
                <p>{msg}</p>
              </div>
            ) : (
              <></>
            )}
            {success ? (
              <div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
                role="alert"
              >
                <p>{msg}, <Link to="/login" className="text-blue-500">login</Link> sekarang.</p>
              </div>
            ) : (
              <></>
            )}
            <h5 className="mt-5 mb-5">
              Isikan password baru anda pada form dibawai ini.
            </h5>
            <label className="bloc text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="mb-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => onInputChange(e)}
              placeholder="*********"
            />
            <label className="bloc text-gray-700 text-sm font-bold mb-2">
              Repeat Password
            </label>
            <input
              type="password"
              name="re_password"
              className="mb-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => onInputChange(e)}
              placeholder="*********"
            />
            {loading ? (
              <button
                className="bg-gray-500 w-full hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline focus:shadow-outline"
                type="button"
              >
                <i className="animate-spin fas fa-circle-notch mr-1"></i>
                Processing....
              </button>
            ) : (
              <button
                onClick={resetPassword}
                className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline focus:shadow-outline flex-1"
                type="button"
              >
                Reset Password
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewPassword;
