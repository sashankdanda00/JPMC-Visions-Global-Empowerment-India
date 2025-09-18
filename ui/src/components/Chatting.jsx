import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, Mic, X, Minus } from "lucide-react";
import "./Chatting.css";

const ai = new GoogleGenerativeAI("AIzaSyB15tc1-P374DJvPv36_rjgc6JTLm4ibg0");

const promptTemplates = {
  en: (input) => `
You are an English-speaking assistant for the NGO Visions Global Empowerment India. Only respond to queries related to Visions Global Empowerment India and avoid any irrelevant topics. If unsure, reply with: 'Sorry, I don't have that information.'

User: ${input}
  `,
  ta: (input) => `
You are a Tamil-speaking assistant for the NGO Visions Global Empowerment India. Only respond to queries related to Visions Global Empowerment India and avoid any irrelevant topics. If unsure, reply with: 'மன்னிக்கவும், எனக்கு அந்தத் தகவல் தெரியவில்லை.'

பயனர்: ${input}
  `,
  hi: (input) => `
You are a Hindi-speaking assistant for the NGO Visions Global Empowerment India. Only respond to queries related to Visions Global Empowerment India and avoid any irrelevant topics. If unsure, reply with: 'क्षमा करें, मुझे वह जानकारी नहीं है।'

उपयोगकर्ता: ${input}
  `,
  te: (input) => `
You are a Telugu-speaking assistant for the NGO Visions Global Empowerment India. Only respond to queries related to Visions Global Empowerment India and avoid any irrelevant topics. If unsure, reply with: 'క్షమించండి, నాకు ఆ సమాచారం తెలియదు.'

వినియోగదారు: ${input}
  `,
  kn: (input) => `
You are a Kannada-speaking assistant for the NGO Visions Global Empowerment India. Only respond to queries related to Visions Global Empowerment India and avoid any irrelevant topics. If unsure, reply with: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಆ ಮಾಹಿತಿಯಿಲ್ಲ.'

ಬಳಕೆದಾರ: ${input}
  `,
  ml: (input) => `
You are a Malayalam-speaking assistant for the NGO Visions Global Empowerment India. Only respond to queries related to Visions Global Empowerment India and avoid any irrelevant topics. If unsure, reply with: 'ക്ഷമിക്കണം, എനിക്ക് ആ വിവരം അറിയില്ല.'

ഉപയോക്താവ്: ${input}
  `,
  bn: (input) => `
You are a Bengali-speaking assistant for the NGO Visions Global Empowerment India. Only respond to queries related to Visions Global Empowerment India and avoid any irrelevant topics. If unsure, reply with: 'দুঃখিত, আমার সেই তথ্য নেই।'

ব্যবহারকারী: ${input}
  `
};

const errorMessages = {
  en: ":warning: An error occurred. Please try again!",
  ta: ":warning: ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்!",
  hi: ":warning: एक त्रुटि हुई है। कृपया पुनः प्रयास करें!",
  te: ":warning: ఒక పొరపాటు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి!",
  kn: ":warning: ತಪ್ಪು ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ!",
  ml: ":warning: ഒരു പിശക് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക!",
  bn: ":warning: একটি ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন!"
};

const speechRecognitionLang = {
  en: "en-US",
  ta: "ta-IN",
  hi: "hi-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  bn: "bn-IN"
};

const Chatting = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [language, setLanguage] = useState("en");

  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = speechRecognitionLang[language] || "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    } else {
      alert("Speech Recognition is not supported in this browser.");
    }
  }, [language]);

  const handleVoiceInput = () => {
    recognitionRef.current?.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: promptTemplates[language](input),
              },
            ],
          },
        ],
      });

      const botResponse = await result.response.text();

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMessages[language] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // For input placeholder text per language:
  const placeholders = {
    en: "Type your message...",
    ta: "உங்கள் செய்தியை உள்ளிடவும்...",
    hi: "अपना संदेश टाइप करें...",
    te: "మీ సందేశాన్ని టైప్ చేయండి...",
    kn: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
    ml: "താങ്കളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...",
    bn: "আপনার বার্তা টাইপ করুন..."
  };

  // For send button text:
  const sendButtonText = {
    en: "Send",
    ta: "அனுப்புக",
    hi: "भेजें",
    te: "పంపండి",
    kn: "ಕಳುಹಿಸಿ",
    ml: "അയയ്ക്കുക",
    bn: "পাঠান"
  };

  return (
    <div>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="chat-toggle-button">
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span className="chat-title">விஷன்ஸ் உதவி</span>
            <div className="chat-header-controls">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-selector"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
              <button onClick={() => setIsMinimized(!isMinimized)} className="icon-button">
                <Minus size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="icon-button">
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <main ref={chatRef} className="chat-messages">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`chat-message-wrapper ${
                      msg.sender === "user"
                        ? "chat-message-user"
                        : "chat-message-bot"
                    }`}
                  >
                    <div className="chat-message">{msg.text}</div>
                  </div>
                ))}
              </main>

              <footer className="chat-footer">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={placeholders[language]}
                  className="chat-input"
                  disabled={loading}
                />
                <button onClick={handleVoiceInput} className="voice-button" title="Voice input">
                  <Mic size={20} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="send-button"
                >
                  {loading ? "..." : sendButtonText[language]}
                </button>
              </footer>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatting;
