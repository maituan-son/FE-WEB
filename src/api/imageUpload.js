import api from "./index";

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("image", file); // key "file" phải khớp với backend

  return api.post("/uploadImage/upload", formData, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
