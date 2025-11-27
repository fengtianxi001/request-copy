import { useLocalStorage } from "../hooks/useLocalStorage";

export const settings = useLocalStorage("app-settings", {
  headers:
    "Accept,Accept-Encoding,Accept-Language,Connection,Host,Origin,Referer,Sec-Fetch-Dest,Sec-Fetch-Mode,Sec-Fetch-Site,User-Agent,sec-ch-ua,sec-ch-ua-mobile,sec-ch-ua-platform",
});
