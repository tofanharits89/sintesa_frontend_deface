import { BubbleChat } from "flowise-embed-react";

import MyContext from "../../../auth/Context";
import { useContext, useEffect, useState } from "react";
import Encrypt from "../../../auth/Random";
import "./ChatModal.css"; // Import file CSS untuk animasi
import { useRef } from "react";

const ChatModal = () => {
  const { axiosJWT, token, verified, name, tampilAI } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const isVerified = verified === "TRUE";
  const [data, setData] = useState([]);
  const [currentPrompts, setCurrentPrompts] = useState([]); // State untuk menyimpan prompt yang tampil
  const [simpan, setSimpan] = useState(false);
  const [messages, setMessages] = useState([]);

  const getData = async () => {
    setLoading(true);
    const query = `SELECT prompt FROM bot.prompt WHERE STATUS=1 ORDER BY id DESC`;
    const encryptedQuery = Encrypt(query.trim());

    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_BOTCENTER}${encryptedQuery}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const formattedData = response.data.result.map(
        (item) => `${item.prompt}`
      );
      setData(formattedData);
      const shuffled = [...formattedData].sort(() => 0.5 - Math.random());
      const selectedPrompts = shuffled.slice(0, 4);
      setCurrentPrompts(selectedPrompts);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil 4 prompt acak dari data
  const updatePrompts = () => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    const selectedPrompts = shuffled.slice(0, 4);
    setCurrentPrompts(selectedPrompts);
  };

  if (verified === "FALSE") {
    return null;
  }

  const simpanPesan = async (messages) => {
    try {
      const response = await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_SIMPAN_CHAT_FLOWISE}`,
        { name: name, chat_id: messages }, // Sertakan chat_id
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Messages saved:", response.data);
    } catch (error) {
      // console.error("Error saving messages:", error);
    }
  };
  // useEffect(() => {
  //   if (messages) {
  //     simpanPesan(messages);
  //   }
  // }, [messages]);

  useEffect(() => {
    getData();
  }, []);

  // useEffect(() => {
  //   updatePrompts(); // Inisialisasi pertama kali
  // }, []);
  // tjoi 6u52 fb7k vaig fu6u np7h jxks y5mb
  return (
    <BubbleChat
      chatflowid="6edd6bbc-621a-43c9-8cbb-fe523952755e"
      apiHost="https://sintesa.kemenkeu.go.id:3000"
      // chatflowid="c8f58ba2-ea25-4435-9e8c-a223e58249be"
      // apiHost="https://localhost:3000"
      // Chat dengan moderasi gunakan dibawah
      // chatflowid="acd9590c-41db-4511-988e-d248afbd7403"
      // apiHost="https://localhost:3000"
      theme={{
        button: {
          backgroundColor: "#3B81F6",
          right: 20,
          bottom: 60,
          size: 48,
          dragAndDrop: true,
          iconColor: "white",
          customIconSrc:
            "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
          autoWindowOpen: {
            autoOpen: false,
            openDelay: 2,
            autoOpenOnMobile: false,
          },
        },
        tooltip: {
          showTooltip: true,
          tooltipMessage: "Aisiteru 👋",
          tooltipBackgroundColor: "black",
          tooltipTextColor: "white",
          tooltipFontSize: 16,
        },
        chatWindow: {
          sourceDocuments: false,
          title: "Aisiteru (v3 Experimental)",
          titleAvatarSrc:
            "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
          showAgentMessages: true,
          welcomeMessage: `Hai ${name.toUpperCase()}, Selamat Datang di Asisten Virtual Sintesa v3 `,
          errorMessage: "Kami tidak menemukan jawaban atas pertanyaan Anda.",
          backgroundColor: "#ffffff",
          fontSize: 16,
          starterPrompts:
            currentPrompts.length > 0
              ? currentPrompts
              : [
                  "Hibah adalah?",
                  "Cara akses Sintesa?",
                  "Siapa Teguh Arifandi?",
                ],
          starterPromptFontSize: 15,
          clearChatOnReload: true,
          poweredByTextColor: "#303235",
          botMessage: {
            backgroundColor: "#f7f8ff",
            textColor: "#303235",
            showAvatar: true,
            avatarSrc:
              "https://pro.drc.ngo/media/ioeorjph/power_bi-removebg-preview.png?anchor=center&mode=crop&quality=80&width=500&height=500&rnd=133137730935100000",
          },
          userMessage: {
            backgroundColor: "#3B81F6",
            textColor: "#ffffff",
            showAvatar: true,
            avatarSrc:
              "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
          },
          textInput: {
            placeholder: "Ketikkan pertanyaan anda ...",
            backgroundColor: "#ffffff",
            textColor: "#303235",
            sendButtonColor: "#3B81F6",
            maxChars: 50,
            maxCharsWarningMessage: "Maksimal 50 karakter.",
            autoFocus: true,
            sendMessageSound: true,
            receiveMessageSound: true,
          },
          feedback: {
            color: "#303235",
          },
          dateTimeToggle: {
            date: true,
            time: true,
          },
          footer: {
            textColor: "#303235",
            text: "Powered by",
            company: "Subdit KKPA | PDPSIPA 2024",
            companyLink: `https://sintesa.kemenkeu.go.id `,
          },
          disclaimer: {
            title: "Disclaimer",
            message:
              'By using this chatbot, you agree to the <a target="_blank" href="https://flowiseai.com/terms">Terms & Condition</a>',
          },
        },
      }}
    />
  );
};

export default ChatModal;
