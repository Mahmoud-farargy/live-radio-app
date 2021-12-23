import { toast } from "react-toastify";
import { localStorageBasicData } from "../info/localStorageSkeletonData";
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