const setToken = (token, iduser, expired, expired_month) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user_id", iduser);
  localStorage.setItem("expired", expired);
  localStorage.setItem("month_expired", expired_month);
};

const getTokenAndUserId = () => {
  const now = new Date();
  let token = localStorage.getItem("token");
  let userid = localStorage.getItem("user_id");
  let expired = localStorage.getItem("expired");
  let month_expired = localStorage.getItem("month_expired");
  let data = {
    token: token,
    userid: userid,
  };
  if (!token || !userid || !expired || !month_expired) {
    return null;
  }
  if (now.getMonth() <= parseInt(month_expired)) {
    if (now.getDate() >= parseInt(expired)) {
      destroyToken();
    } else {
      return data;
    }
  } else {
    destroyToken();
  }
};

const destroyToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("month_expired");
  localStorage.removeItem("expired");
};

const isAuthenticated = () => {
  if (getTokenAndUserId()) return true;
  else return false;
};

const Auth = {
  setToken,
  getTokenAndUserId,
  destroyToken,
  isAuthenticated,
};

export default Auth;
