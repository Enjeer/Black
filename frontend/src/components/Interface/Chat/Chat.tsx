import React from 'react'
import { useEffect, useRef, useState } from 'react';
import './Chat.css'
import sendImg from '../../../assets/img/send.png'

const Chat = () => {

    const [history, setHistory] = useState<Array<[string, string, Date]>>([]);
    const chatRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!chatRef.current) return;
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [history]);

    const sendMessage = async (text: string) => {
        const messages = [
            ...history.map(h => ({
                role: h[0],
                content: h[1]
            })),
            { role: "user", content: text }
        ];

        // добавляем сообщение пользователя
        setHistory(prev => [...prev, ['user', text, new Date()]]);

        // добавляем пустое сообщение ассистента
        setHistory(prev => [...prev, ['assistant', '', new Date()]]);

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

                copy[lastIndex] = [
                    copy[lastIndex][0], // 'assistant'
                    botMessage,
                    copy[lastIndex][2]  // ts не меняем
                ];

                return copy;
            });
        }
    };
    interface MessageProps {
        source: string;
        content: string;
        ts: Date;
    }

    const Message: React.FC<MessageProps> = ({ source, content, ts }) => {
        const formatedDate = ts.toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' });
        return (
            <div className={`messageContainer ${source}`}>
                <div className="messageTime">{formatedDate}</div>
                <div className="messageContent">{content}</div>
            </div>
        );
    };

    const newUserMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const textarea = form.elements.namedItem("text") as HTMLTextAreaElement;

        const content = textarea.value.trim();
        if (!content) return;

        textarea.value = '';
        autoResize(textarea);

        await sendMessage(content);
    };

    // resizing of textarea
    const autoResize = (el: HTMLTextAreaElement) => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    return(
        <div className="chatContainer">
            <div className="chat" ref={chatRef}>
                {history.map((h, idx) => (
                    <Message key={idx} source={h[0]} content={h[1]} ts={h[2]} />
                ))}
            </div>
            <form onSubmit={newUserMessage}>
                <textarea name='text' onInput={(e) => autoResize(e.currentTarget)}/>
                <button type="submit">
                    <img src={sendImg} alt="" />
                </button>
            </form>
        </div>
    )
}

export default Chat