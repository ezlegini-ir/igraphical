import { useState } from "react";

const useSuccess = () => {
  const [success, setSuccess] = useState("");
  return { success, setSuccess };
};

export default useSuccess;
