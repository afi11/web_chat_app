import React, { useEffect, useState } from "react";
import axios from "axios";
import Moment from "react-moment";
import { useParams, useHistory } from "react-router-dom";
import { ReactMic } from "react-mic";
import { urlApiMain, urlWeb } from "../../utils/url";
import { Auth } from "../../config";
import Swal from "sweetalert2";

const ChatRoom = () => {
  const { id } = useParams();

  let history = useHistory();

  const [recordAudio, setRecordAudio] = useState(false);
  const [resetAudio, setResetAudio] = useState(false);

  const [user, setUser] = useState([]);
  const [waiting, setWaiting] = useState(false);

  const [messages, setMessages] = useState([]);
  const [sendmessage, setSetmessage] = useState({
    messages: "",
    image: "",
    audio: "",
    receiver: id,
  });

  const onDataAudio = (recordedBlob) => {};

  // show / hide audio / message
  const showMessageComponent = () => {
    document.querySelector(".input-message").classList.remove("hidden");
    document.querySelector(".btn-img-message").classList.remove("hidden");
  };

  const hideMessageComponent = () => {
    document.querySelector(".input-message").classList.add("hidden");
    document.querySelector(".btn-img-message").classList.add("hidden");
  };

  const hideAudioComponent = () => {
    const previewAudioMessage = document.querySelector(
      ".preview-audio-message"
    );
    previewAudioMessage.classList.add("hidden");
  };

  const showAudioComponent = () => {
    const previewAudioMessage = document.querySelector(
      ".preview-audio-message"
    );
    previewAudioMessage.classList.remove("hidden");
  };

  const startRecordAudio = () => {
    showAudioComponent();
    hideMessageComponent();
    setRecordAudio(true);
    document.querySelector("#button_send_message").classList.add("hidden");
  };

  const stopRecordAudio = () => {
    setResetAudio(true);
    setRecordAudio(false);
    document.querySelector("#button_send_message").classList.remove("hidden");
  };

  const resetRecordAudio = () => {
    setResetAudio(false);
    setSetmessage({
      ...sendmessage,
      ["audio"]: "",
    });
    showMessageComponent();
    hideAudioComponent();
  };

  const onStopAudio = (recordedBlob) => {
    if (!resetAudio) {
      console.log("recordedBlob is: ", recordedBlob.blob);
      var fileReader = new FileReader();
      fileReader.readAsDataURL(recordedBlob.blob);
      fileReader.onload = (e) => {
        setSetmessage({
          ...sendmessage,
          ["audio"]: e.target.result,
        });
        document
          .querySelector("#button_send_message")
          .classList.remove("hidden");
      };
    } else {
      setSetmessage({
        ...sendmessage,
        ["audio"]: "",
      });
      setRecordAudio(false);
    }
  };

  const getChat = () => {
    axios
      .get(`${urlApiMain}getchat/${id}`)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {});
  };

  const getUser = () => {
    axios
      .get(`${urlApiMain}getuser/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {});
  };

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    setSetmessage({
      ...sendmessage,
      [name]: value,
    });
  };

  const getFile = () => {
    document.getElementById("fileImage").click();
  };

  const getFileMessage = (event) => {
    var fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    const { type } = event.target.files[0];
    if (type == "image/png" || type == "image/jpeg") {
      fileReader.onload = (e) => {
        setSetmessage({
          ...sendmessage,
          ["image"]: e.target.result,
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

  const clearImage = () => {
    setSetmessage({
      ...sendmessage,
      ["image"]: "",
    });
  };

  const readMessage = () => {
    axios
      .get(`${urlApiMain}readmessage/${id}`)
      .then((res) => {})
      .then((err) => {});
  };

  const sendMessage = () => {
    setWaiting(true);
    axios.post(urlApiMain + "sendchat", sendmessage).then((res) => {
      setWaiting(false);
      resetRecordAudio(false);
      showMessageComponent();
      hideAudioComponent();
      getChat();
      setSetmessage({
        ...sendmessage,
        ["messages"]: "",
        ["image"]: "",
        ["audio"]: "",
      });
    });
  };

  // set permission audio
  useEffect(() => {
    document.title = "Chatroom";
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        // setIsBlocked(false);
      },
      () => {
        console.log("Permission Denied");
        // setIsBlocked(true);
      }
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getUser();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      readMessage();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getChat();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="bg-white md:w-1/2 mt-4 mb-6 rounded shadow-lg">
        <div className="px-6 py-6">
          <div className="flex mb-2">
            <h1
              className="font-semibold text-xl mt-1"
              onClick={() => history.push("/")}
            >
              <i class="fas fa-arrow-left"></i>
            </h1>
            <div className="flex flex-row ml-3">
              <img
                className="rounded-full img-profil-latest"
                src={urlWeb + "profil/" + user.photo}
              />
              <div className="flex flex-col ml-2">
                <p className="text-black">{user.name}</p>
                <p className="text-gray-600 text-status">
                  {user.login_at != null ? "Online" : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 message-height px-3 py-2 overflow-auto">
            {messages.map((message) =>
              message.sender == Auth.getTokenAndUserId().userid ? (
                <div className="flex flex-col items-end mb-3">
                  <div className="w-1/2 px-3 py-2 right-0 rounded-tl-lg rounded-br-lg bg-green-300">
                    {message.image === null ? (
                      <></>
                    ) : (
                      <img src={urlWeb + "messages/" + message.image} />
                    )}
                    {message.audio === null ? (
                      <></>
                    ) : (
                      <audio
                        className="w-full"
                        controls
                        src={urlWeb + "audios/" + message.audio}
                      />
                    )}
                    <p className="text-gray-800">{message.messages}</p>
                    <div className="flex flex-row w-full">
                      <p className="text-gray-700 font-bold text-sm">
                        <Moment fromNow>{message.created_at}</Moment>
                      </p>
                      {message.is_read == "1" ? (
                        <i class="fas fa-check mt-1 ml-2 text-blue-500"></i>
                      ) : (
                        <i class="fas fa-check mt-1 ml-2 text-gray-500"></i>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start mb-3">
                  <div className="w-1/2 px-3 py-2 right-0 rounded-tr-lg rounded-bl-lg bg-orange-300">
                    {message.image === null ? (
                      <></>
                    ) : (
                      <img src={urlWeb + "messages/" + message.image} />
                    )}
                    {message.audio === null ? (
                      <></>
                    ) : (
                      <audio
                        className="w-full"
                        controls
                        src={urlWeb + "audios/" + message.audio}
                      />
                    )}
                    <p className="text-gray-800">{message.messages}</p>
                    <p className="text-gray-700 font-bold text-sm">
                      <Moment fromNow>{message.created_at}</Moment>
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
          {waiting ? (
            <div className="text-center mb-3 mt-3">
              <h5 className="text-md text-gray-800 font-bold">
                Mengirim pesan....
              </h5>
            </div>
          ) : (
            <></>
          )}
          {sendmessage.image != "" ? (
            <div className="flex flex-row items-center justify-center mt-2 rounded bg-gray-200 px-3 py-2">
              <div>
                <img
                  className="image-message"
                  src={sendmessage.image}
                  alt="Image File"
                />
              </div>
              <div>
                <button
                  onClick={clearImage}
                  className="bg-red-600 hover:bg-red-900 text-white ml-2 font-bold px-4 py-3 rounded-full"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="flex mt-3">
            {recordAudio ? (
              <>
                <button
                  onClick={stopRecordAudio}
                  className="btn-stop-audio bg-gray-700 hover:bg-gray-700 text-white font-bold px-4 py-3 mr-1 rounded-full"
                >
                  STOP
                </button>
                <></>
              </>
            ) : !resetAudio ? (
              <button
                onClick={startRecordAudio}
                className="bg-gray-400 hover:bg-gray-700 text-white font-bold px-4 py-3 mr-1 rounded-full"
              >
                <i class="fa fa-microphone"></i>
              </button>
            ) : (
              <></>
            )}
            {resetAudio ? (
              <button
                onClick={resetRecordAudio}
                className="btn-stop-audio bg-red-700 hover:bg-red-700 text-white font-bold px-4 py-3 mr-1 rounded-full"
              >
                RESET
              </button>
            ) : (
              <></>
            )}
            <ReactMic
              record={recordAudio}
              className="rounded-full hidden preview-audio-message h-audio mr-4"
              onStop={onStopAudio}
              onData={onDataAudio}
              strokeColor="#cbd5e0"
              backgroundColor="#4a5568"
            />
            <input
              id="text_message"
              name="messages"
              value={sendmessage.messages}
              onChange={(e) => onChangeInput(e)}
              className="input-message appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-full 
              mr-4 py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              placeholder="Type message here...."
            />
            {/* <!-- Image Button Picker --> */}
            <input
              type="file"
              name="image"
              onChange={(e) => getFileMessage(e)}
              id="fileImage"
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={getFile}
              className="btn-img-message bg-green-400 hover:bg-green-700 text-white font-bold px-4 py-3 mr-1 rounded-full"
            >
              <i className="fas fa-camera"></i>
            </button>
            <button
              id="button_send_message"
              onClick={sendMessage}
              className="bg-blue-400 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-full"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
