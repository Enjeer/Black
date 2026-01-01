import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import micInput from '../../../assets/img/micInput.svg';
import txtInput from '../../../assets/img/textInput.svg';

interface MessageProps {
    source: string;
    content: string;
    ts: Date;
}

const Chat: React.FC = () => {
    const [history, setHistory] = useState<Array<[string, string, Date]>>([]);
    const [inputMode, setInputMode] = useState<'mic' | 'txt'>('mic');
    const chatRef = useRef<HTMLDivElement>(null);
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // скролл вниз
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8000/stream-voice");

        let buffer = "";          // буфер для накопления текста
        let sendTimer: NodeJS.Timeout | null = null;

        eventSource.onmessage = (e) => {
            const newText = e.data;   // поступивший фрагмент
            buffer = newText;         // заменяем весь текст или можно делать += для пословного добавления
            if (textareaRef.current) {
                textareaRef.current.value = buffer;
                autoResize(textareaRef.current);
            }

            // таймер отправки после паузы (например 1 сек)
            if (sendTimer) clearTimeout(sendTimer);
            sendTimer = setTimeout(() => {
                submitMessage(); // отправляем накопленный текст
                buffer = "";           // очищаем буфер после отправки
            }, 1000); // пауза в 1 сек
        };

        return () => eventSource.close();
    }, []);

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
        try {
            const res = await fetch("http://localhost:8000/enable-voice", { method: "POST" });
            const data = await res.json();
            console.log("Voice broadcast enabled:", data);
        } catch (err) {
            console.error(err);
        }
    };

    const autoResize = (el: HTMLTextAreaElement) => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
        setInputMode(el.value.trim() ? 'txt' : 'mic');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    };

    const Message: React.FC<MessageProps> = ({ source, content, ts }) => (
        <div className={`messageContainer ${source}`}>
            <div className="messageTime">{ts.toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}</div>
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
                <button type="submit" onClick={() => {
                    if (inputMode === 'txt') submitMessage();
                    else enableVoice();
                }}>
                    <img src={inputMode === 'txt' ? txtInput : micInput} alt="" />
                </button>
            </form>
        </div>
    );
};

export default Chat;
