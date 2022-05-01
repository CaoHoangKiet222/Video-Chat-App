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
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const newdate = day + " " + monthNames[month] + " " + year;
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  if (parseInt(h.slice(-2)) >= 13) {
    return `${newdate}, ${h.slice(-2)}:${m.slice(-2)} pm`;
  }
  return `${newdate}, ${h.slice(-2)}:${m.slice(-2)} am`;
};

export const getUserMedia = () => {
  let currentStream;
  const getStream = async () => {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };
  getStream();
  return currentStream;
};
