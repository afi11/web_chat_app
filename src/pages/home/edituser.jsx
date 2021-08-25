import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { urlApiMain, urlWeb } from "../../utils/url";

const EditUser = () => {
  const [waiting, setWaiting] = useState(false);

  const [profil, setProfil] = useState({
    id: "",
    name: "",
    photo: "",
  });
  const [updatePhoto, setUpdatePhoto] = useState(false);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setProfil({
      ...profil,
      [name]: value,
    });
  };

  const getProfil = () => {
    axios.get(`${urlApiMain}profil`).then((res) => {
      setProfil({
        ...profil,
        ["id"]: res.data[0].id,
        ["name"]: res.data[0].name,
        ["photo"]: res.data[0].photo,
      });
    });
  };

  const getFile = () => {
    document.getElementById("fileImage").click();
    setUpdatePhoto(true);
  };

  const getFileMessage = (event) => {
    var fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    const { type } = event.target.files[0];
    console.log(event.target.files[0]);
    if (type == "image/png" || type == "image/jpeg") {
      fileReader.onload = (e) => {
        setProfil({
          ...profil,
          ["new_photo"]: e.target.result,
        });
      };
    } else {
      Swal.fire(
        "Gagal Ambil Gambar",
        "File harus dalam bentuk extensi jpeg / png",
        "error"
      );
    }
  };

  const updateProfil = () => {
    setWaiting(true);
    axios
      .post(`${urlApiMain}update_profil`, profil)
      .then(() => {
        setWaiting(false);
        Swal.fire("Berhasil!", "Profil berhasil diperbaruhi", "success");
      })
      .catch((err) => {
        setWaiting(false);
        Swal.fire("Gagal!", err, "error");
      });
  };

  useEffect(() => {
    document.title = "Edit User";
  }, []);

  useEffect(() => {
    getProfil();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="bg-white md:w-1/3 mt-16 rounded shadow-md px-6 py-6">
        <p className="font-semibold text-lg">Edit Profil</p>
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-2 mb-3 mt-3"
          role="alert"
        >
          <p>Cukup isi form yang ingin diubah.</p>
        </div>
        <div className="flex flex-col items-center">
          <img
            className="w-1/3 flex-1 rounded-full items-center"
            src={updatePhoto ? profil.new_photo : `${urlWeb}profil/${profil.photo}`}
          />
          <input
            type="file"
            name="new_photo"
            onChange={(e) => getFileMessage(e)}
            id="fileImage"
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={getFile}
            className="bg-blue-500 mt-3 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-full"
          >
            <i class="fas fa-camera"></i>
          </button>
        </div>
        <label className="bloc text-gray-700 text-sm font-bold mb-2">
          Nama
        </label>
        <input
          type="text"
          name="name"
          value={profil.name}
          className="mt-2 mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => onInputChange(e)}
          placeholder="Robert"
        />
        <div className="flex mt-2">
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
              onClick={updateProfil}
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline focus:shadow-outline"
            >
              SIMPAN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUser;
