"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, X } from "lucide-react"

interface ChatWidgetProps {
  onClose: () => void
}

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState([{ id: 1, text: "Hi! How can I help you today?", sender: "bot" }])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { id: prev.length + 1, text: input, sender: "user" }])
      setInput("")

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: prev.length + 1, text: "Processing your request...", sender: "bot" }])
      }, 500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="absolute bottom-20 right-0 w-80 h-96 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-bold">A.R.U.S. Assistant</h3>
          <p className="text-xs text-muted-foreground">Always here to help</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-white/10 text-foreground rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
