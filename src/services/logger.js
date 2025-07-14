import axios from "axios";

export const logEvent = async (token, stack, level, pkg, message) => {
  try {
    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return res.data;
  } catch (err) {
    console.error("Logging failed:", err);
  }
};
