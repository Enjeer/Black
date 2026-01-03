import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import micInputIdle from '../../../assets/img/micInput_idle.svg';
import micInputListening from '../../../assets/img/micInput_listening.svg';
import micInputWaiting from '../../../assets/img/micInput_waiting.svg';
import txtInputIdle from '../../../assets/img/textInput_idle.svg';
import txtInputWaiting from '../../../assets/img/textInput_waiting.svg';

interface MessageProps {
    source: string;
    content: string;
    ts: Date;
}

const Chat: React.FC = () => {
    const [history, setHistory] = useState<Array<[string, string, Date]>>([]);
    const [inputMode, setInputMode] = useState<'mic' | 'txt'>('mic');
    const [buttonPic, setButtonPic] = useState('mic_idle');
    const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'waiting'>('idle');
    const [broadcasting, setBroadcasting] = useState(false);
    const llmBusy = voiceState === 'waiting';
    const [buttonDisbled, setButtonDisbled] = useState(true);

    const formButtonImage = {
        'mic_idle' : micInputIdle,
        'mic_listening' : micInputListening,
        'mic_waiting' : micInputWaiting,
        'txt_idle' : txtInputIdle,
        'txt_waiting' : txtInputWaiting,
    }

    const chatRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Отступ чата 
    useEffect(() => {
        const form = document.querySelector('form');
        if (!form) return;

        const resize = () => {
            document.documentElement.style.setProperty(
                '--input-height',
                `${form.offsetHeight}px`
            );
        };

        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(form);

        return () => ro.disconnect();
    }, []);

    // скролл вниз
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [history]);

    // Состояние голоса  
    useEffect(() => {
        const es = new EventSource("http://localhost:8000/stream-voice-state");

        es.onmessage = (e) => {
            console.log("VOICE STATE:", e.data);
            setVoiceState(e.data); // idle | listening | waiting
        };

        return () => es.close();
    }, []);

    // Отправка с голосового ввода
    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8000/stream-voice");

        eventSource.onmessage = (e) => {
            const text = e.data;
            if (textareaRef.current) {
                textareaRef.current.value = text;
            }
            submitMessage();
        };

        return () => eventSource.close();
    }, []);

    useEffect(() => {
        setButtonPic(`${inputMode}_${voiceState}`);
    }, [voiceState, inputMode]);
    
    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        // добавляем сообщение пользователя
        setHistory(prev => [...prev, ['user', text, new Date()]]);
        setHistory(prev => [...prev, ['assistant', '', new Date()]]);

        const messages = [
            ...history.map(h => ({ role: h[0], content: h[1] })),
            { role: 'user', content: text }
        ];

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages }),
            });

            const reader = res.body!.getReader();
            const decoder = new TextDecoder();
            let botMessage = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                botMessage += decoder.decode(value, { stream: true });

                setHistory(prev => {
                    const copy = [...prev];
                    const lastIndex = copy.length - 1;
                    copy[lastIndex] = [copy[lastIndex][0], botMessage, copy[lastIndex][2]];
                    return copy;
                });
            }
        } catch (err) {
            console.error("Chat request error:", err);
        }
    };

    const submitMessage = async () => {
        if (llmBusy) {
            console.log("LLM busy — text blocked");
            return;
        }

        if (!textareaRef.current) return;
        const text = textareaRef.current.value.trim();
        if (!text) return;

        textareaRef.current.value = '';
        autoResize(textareaRef.current);

        await sendMessage(text);
    };

    const newUserMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitMessage();
    };

    const enableVoice = async () => {
        if(!broadcasting){
            try {
                const res = await fetch("http://localhost:8000/enable-voice", { method: "POST" });
                const data = await res.json();
                console.log("Voice broadcast enabled:", data);
                setBroadcasting(true);
                // 🔹 сразу же закрываем режим
                // await fetch("http://localhost:8000/disable-voice", { method: "POST" });
            } catch (err) {
                console.error(err);
            }
        }
        else{
            try {
                const res = await fetch("http://localhost:8000/disable-voice", { method: "POST" });
                const data = await res.json();
                console.log("Voice broadcast enabled:", data);
                setBroadcasting(false);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const autoResize = (el: HTMLTextAreaElement) => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
        setInputMode(el.value.trim() ? 'txt' : 'mic');
        setButtonDisbled(el.value.trim() ? true : false)
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    };

    const Message: React.FC<MessageProps> = ({ source, content, ts }) => (
        <div className={`messageContainer ${source}`}>
            <div className="messageTime">
                {ts.toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="messageContent">{content}</div>
        </div>
    );


    return (
        <div className="chatContainer">
            <div className="chat" ref={chatRef}>
                {history.map((h, idx) => (
                    <Message key={idx} source={h[0]} content={h[1]} ts={h[2]} />
                ))}
            </div>
            <form onSubmit={newUserMessage}>
                <textarea
                    name="text"
                    ref={textareaRef}
                    rows={1}
                    onInput={(e) => autoResize(e.currentTarget)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите сообщение..."
                />
                <button className={buttonPic} disabled={buttonDisbled} type="submit" onClick={() => {
                    if (inputMode === 'txt') submitMessage();
                    else enableVoice();
                }}>
                    <img src={formButtonImage[buttonPic]}/>
                </button>
            </form>
        </div>
    );
};

export default Chat;
