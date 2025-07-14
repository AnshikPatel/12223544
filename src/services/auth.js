import axios from "axios";

export const getAccessToken = async () => {
  try {
    const response = await axios.post("http://localhost:8010/proxy/evaluation-service/auth", {
      email: "ramkrishna@abc.edu",
      name: "Ram Krishna",
      rollNo: "12223544",
      accessCode: "xgAsNC",
      clientID: "d9cbb699-6a27-44a5-8d59-8b1befa816da",
      clientSecret: "tVJaaaRBSeXcRXeM"
    });

    console.log("✅ Access Token Response:", response.data);
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Token fetch error:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }
    return null;
  }
};
