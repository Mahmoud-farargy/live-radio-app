import { toast } from "react-toastify";
import { localStorageBasicData } from "../info/localStorageSkeletonData";
import defaultImg from "../desgin/Assets/radio.jpg";

// Notify
export const notify = (text, type) => {
    switch (type) {
      case "success":
        toast.success(text);
        break;
      case "warning":
        toast.warn(text);
        break;
      case "error":
        toast.error(text);
        break;
      case "info":
        toast.info(text);
        break;
      case "dark":
        toast.dark(text);
        break;
      default:
        toast(text);
    }
  };
//trim text
export const trimText = (txt, limit) => txt ? (`${txt.split("").length > limit ? txt.split("").slice(0,limit).join("")+"..." : txt}`) : "";

export const locStorage = ({type, newData, destination}) =>{
  if(type === "set" && (Array.isArray(newData) || typeof newData === "object")){
    const storageCopy = locStorage({type: "get"});
    const newLocStorageArr = {...storageCopy, [destination] : newData};
    Object.keys(localStorageBasicData).forEach(key => {
        if(!newLocStorageArr.hasOwnProperty(key)){
            newLocStorageArr[key] = localStorageBasicData[key];
        }
    });
    localStorage.setItem("soundex", JSON.stringify(newLocStorageArr));
    
  } else if(type === "get"){
    return JSON.parse(localStorage.getItem("soundex"));
  } else if(type === "clear"){
    localStorage.clear();
  }
  return {};
};

export const serialize = function(obj) {
  if(typeof obj === "object"){
    var str = [];
   
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        const val = obj[p];
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(typeof val === "string" ? val?.replace(/\s/g, "_") : val));
      }
    return str.join("&");
  }
  return "";
};

export const getObjectFromQueries = (query) => {
  return query ? (JSON.parse('{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/%2C_/g,", ") + '"}')) : "";
};

export const selectTheme = (currTheme) => ({
  ...currTheme,
    colors: {
        ...currTheme.colors,
        primary: "#31c27c",
        primary25: "#31c27c1f"
    }
});

export const hashtigify = (item) => {
  if (!item) return "";
  return `#${item.toLowerCase()?.replace(/[\s-.]/g, "_")}`;
}

export const stringifyNumber = (num) => {
  return typeof num === "number" ? num.toLocaleString() : "";
}

export const lowerString = (str) => (str && typeof str === "string") ? (str.toLowerCase()): "";
export const upperString = (str) => (str && typeof str === "string") ? (str.toUpperCase()): "";

export const isValidAudioSrc = (src) => {
  return (
    typeof src === "string" &&
    src.trim().length > 0 &&
    /^https?:\/\//i.test(src)
  );
};

export const convertToAPlayerItem = (item) => {

  return {
    name: item.name,
    musicSrc: (item.url_resolved || item.url),
    cover: defaultImg,
    duration: 0,
    singer: item.country,
    id: item.stationuuid,
    stationuuid: item.stationuuid,
    country: item.country ?? "",
    state: item.state ?? "",
    homepage: item.homepage,
    tags: item.tags,
    votes: item.votes,
    language: item.language,
  }
}

export const arraysMatchById = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  const ids = new Set();

  for (const item of arr1) {
    ids.add(item.id);
  }

  for (const item of arr2) {
    if (!ids.has(item.id)) return false;
  }

  return true;
}
