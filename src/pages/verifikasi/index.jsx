import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { urlApiMain } from "../../utils/url";

const VerifikasiUser = () => {
  const [mail, setMail] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    document.title = "Verifikasi Akun";
    setMail({
      ...mail,
      email: query.get("mail"),
    });
  }, []);

  const verifAkun = () => {
    setLoading(true);
    axios.post(`${urlApiMain}verify_user`, mail).then((res) => {
      if (res.data === "Email belum terdaftar") {
        setLoading(false);
        setMsg(res.data);
        setError(true);
      } else {
        setLoading(false);
        setMsg(
          "Berhasil melakukan verifikasi akun, silahkan login dengan email dan password anda!"
        );
        setSuccess(true);
      }
    });
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 h-96">
          <h5 className="font-semibold text-2xl mb-3 text-blue-900 text-center">
            <i className="fas fa-envelope-open-text"></i> Instant Message!{" "}
          </h5>
          <div className="bg-white px-8 pt-6 pb-8 mb-4 rounded overflow-hidden shadow-lg">
            <h1 className="text-center font-medium text-xl text-gray-800">
              Verifikasi Akun
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
                <p>
                  {msg},{" "}
                  <Link className="text-blue-500" to="/login">
                    login
                  </Link>{" "}
                  sekarang
                </p>
              </div>
            ) : (
              <></>
            )}
            <h5 className="mt-5 mb-5">
              Klik tombol dibawah ini untuk melakukan verifikasi akun.
            </h5>
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
                onClick={verifAkun}
                className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline focus:shadow-outline flex-1"
                type="button"
              >
                Verifikasi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifikasiUser;
