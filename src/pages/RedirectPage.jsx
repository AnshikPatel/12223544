import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RedirectPage = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const redirectToLongUrl = async () => {
      try {
        const res = await axios.get(`http://20.244.56.144/url-shortener/${shortcode}`);
        window.location.href = res.data.longUrl;
      } catch (err) {
        alert("Invalid or expired shortcode");
        console.error(err);
      }
    };

    redirectToLongUrl();
  }, [shortcode]);

  return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Redirecting...</h2>;
};

export default RedirectPage;
