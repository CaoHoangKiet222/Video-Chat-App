export const postData = async (url, method, data = {}) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const formatHour = (date) => {
  date = new Date(date);
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  if (parseInt(h.slice(-2)) >= 13) {
    return `${h.slice(-2)}:${m.slice(-2)} pm`;
  }
  return `${h.slice(-2)}:${m.slice(-2)} am`;
};

export const formatDate = (date) => {
  date = new Date(date);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return day + " " + monthNames[month] + " " + year;
};

export const checkSameDate = (predate, date) => {
  date = new Date(date);
  predate = new Date(predate);
  if (formatDate(date) === formatDate(predate)) {
    return true;
  }
  return false;
};

export const searchUser = (user, searchName) => {
  if (
    searchName === "" ||
    user.name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1
  ) {
    return true;
  }
  return false;
};

export const getUserMedia = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};
