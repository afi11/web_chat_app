import React, { useEffect, useState } from "react";
import AutoComplete from "../../components/autocomplete";
import axios from "axios";
import favicon from "../../assets/favicon.ico";
import { urlApiMain, urlWeb } from "../../utils/url";
import { Link } from "react-router-dom";
import { Auth } from "../../config";
import Push from "push.js";
import Moment from "react-moment";
import Swal from "sweetalert2";

const CountUnreadMessage = (props) => {
  const { sender, receiver } = props;
  const [count_unreadMessage, setUnreadMessage] = useState(0);

  const unreadMessage = (sender, receiver) => {
    axios
      .get(`${urlApiMain}countunreadmessage/${sender}/${receiver}`)
      .then((res) => {
        setUnreadMessage(res.data);
        if (res.data > 0) {
          let sw = sessionStorage.getItem("show_notification");
          if (sw == 0) {
            sessionStorage.setItem("show_notification", 1);
            axios
              .get(`${urlApiMain}unreadmessage/${sender}`)
              .then((res) => {
                showNotif(
                  `${urlWeb}profil/${res.data.photo}`,
                  res.data.name,
                  res.data.messages
                );
              })
              .catch((err) => {});
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showNotif = (photo, name, message) => {
    Push.create("New message from " + name, {
      body: message,
      icon: photo,
      timeout: 4000,
      onClick: function () {
        window.focus();
        this.close();
      },
    });
  };

  useEffect(() => {
    document.title = "Home";
  }, []);

  useEffect(() => {
    // unreadMessage(sender, receiver);
    const interval = setInterval(() => {
      unreadMessage(sender, receiver);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="absolute right-0">
        {count_unreadMessage > 0 ? (
          <div className="bg-green-400 rounded-full p-1 items-center justify-center">
            <p className="font-bold text-white text-sm">
              {count_unreadMessage}
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

const LatestMessage = (props) => {
  const { sender, receiver } = props;
  const [latestMessage, setLatestMessage] = useState({});

  const getLatestMessage = (sender, receiver) => {
    axios
      .get(`${urlApiMain}getlatetsmessage/${sender}/${receiver}`)
      .then((res) => {
        setLatestMessage(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getLatestMessage(sender, receiver);
  }, []);

  return (
    <div className="flex flex-row relative mb-2">
      <p>
        {latestMessage.image ? <i class="fas fa-image"></i> : <></>}{" "}
        {latestMessage.messages}
      </p>
      <p className="absolute right-0">
        <Moment fromNow>{latestMessage.created_at}</Moment>
      </p>
    </div>
  );
};

const Home = () => {
  const [profil, setProfil] = useState([]);
  const [userToTalk, setUserToTalk] = useState([]);
  const [userLatestMessages, setUserLatestMessages] = useState([]);

  const getProfil = () => {
    axios
      .get(`${urlApiMain}profil`)
      .then((res) => {
        setProfil(res.data[0]);
      })
      .catch((err) => {});
  };

  const logout = () => {
    Swal.fire({
      title: "Apakah anda yakin ingin keluar aplikasi",
      showCancelButton: true,
      confirmButtonText: `Logout`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios
          .get(
            `${urlApiMain}updateuserclose/${Auth.getTokenAndUserId().userid}`
          )
          .then((res) => {
            Auth.destroyToken();
            window.location.reload();
          })
          .catch();
      }
    });
  };

  const letsMessageWithPeople = () => {
    axios
      .get(`${urlApiMain}letmessage`)
      .then((res) => {
        setUserToTalk(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const latestMessages = () => {
    axios
      .get(`${urlApiMain}latestmessage`)
      .then((res) => {
        setUserLatestMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProfil();
    letsMessageWithPeople();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      latestMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row justify-center">
      <div className="bg-white w-1/4 mr-4 mt-6 rounded shadow-md">
        <div className="px-6 py-6">
          <div className="flex flex-col items-center">
            <img
              className="w-1/3 flex-1 rounded-full items-center"
              src={`${urlWeb}profil/${profil.photo}`}
            />
            <h3 className="flex-1 text-gray-800 font-semibold text-xl">
              {profil.name}
            </h3>
            <h3 className="flex-1 text-gray-500 profil-email">
              {profil.email}
            </h3>
            <div className="flex flex-row mt-4">
              <Link
                to={`edit_user`}
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold px-4 py-2 mr-2 rounded-full"
              >
                <i class="fas fa-edit"></i>
              </Link>
              <button
                onClick={logout}
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-full"
              >
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white w-1/2 mt-6 rounded shadow-md">
        <div className="px-6 py-6">
          <h5 className="font-semibold text-xl mb-3 text-blue-900">
            Daftar Pesan Terakhir
          </h5>
          <AutoComplete suggestions={userToTalk} />
          <ul className="mt-3">
            {userLatestMessages.map((latestUser) => (
              <>
                <li className="flex flex-row relative mt-2">
                  <img
                    className="rounded-full img-profil-latest"
                    src={urlWeb + "profil/" + latestUser.photo}
                  />
                  <Link
                    className="text-gray-700 font-semibold text-lg ml-2"
                    to={`/chat/${latestUser.id}`}
                  >
                    {latestUser.name}
                  </Link>
                  <CountUnreadMessage
                    sender={latestUser.id}
                    receiver={Auth.getTokenAndUserId().userid}
                  />
                </li>
                <LatestMessage
                  sender={latestUser.id}
                  receiver={Auth.getTokenAndUserId().userid}
                />
                <hr />
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
