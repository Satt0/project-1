import { useState } from "react";
import { toast } from "react-toastify";
import { URL } from "./index";
export const useUpload = () => {
  const [response, setResult] = useState(false);

  const handler = async (files = []) => {
    try {
      if (files.length === 0) return toast("bạn chưa chọn file nào");
      const data = new FormData();
      for (let i = 0; i < files.length; ++i) {
        data.append("media", files[i]);
      }

      const response = await fetch(URL + "/media/upload", {
        method: "POST",
        headers: {
          //   "Content-Type": "multipart/form-data"
        },
        body: data,
      }).then((res) => res.json());
      if (response.error) {
        toast("upload lỗi");
        return setResult({
          error: true,
          result: null,
        });
      }
      setResult({
        error: false,
        result: response.data,
      });
    } catch (e) {
      return setResult({
        error: true,
        result: null,
      });
    }
  };
  return [handler, response];
};
