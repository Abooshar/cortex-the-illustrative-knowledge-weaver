import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Bot, User, Clock, Wrench, BrainCircuit, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { chatService, formatTime, renderToolCall } from '@/lib/chat';
import type { ChatState } from '../../worker/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function SearchPage() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    sessionId: chatService.getSessionId(),
    isProcessing: false,
    model: 'google-ai-studio/gemini-2.5-flash',
    streamingMessage: ''
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [chatState.messages, chatState.streamingMessage]);
  const loadCurrentSession = useCallback(async () => {
    const response = await chatService.getMessages();
    if (response.success && response.data) {
      setChatState(prev => ({ ...prev, ...response.data }));
    }
  }, []);
  useEffect(() => {
    loadCurrentSession();
  }, [loadCurrentSession]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatState.isProcessing) return;
    const message = input.trim();
    setInput('');
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: message,
      timestamp: Date.now()
    };
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
      streamingMessage: ''
    }));
    await chatService.sendMessage(message, chatState.model, (chunk) => {
      setChatState(prev => ({
        ...prev,
        streamingMessage: (prev.streamingMessage || '') + chunk
      }));
    });
    await loadCurrentSession();
    setChatState(prev => ({ ...prev, isProcessing: false, streamingMessage: '' }));
  };
  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-6"
      >
        <Sparkles className="w-8 h-8 text-cortex-primary" />
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            AI Search
          </h1>
          <p className="text-sm text-muted-foreground">
            Ask questions in natural language to query your knowledge base.
          </p>
        </div>
      </motion.div>
      <Card className="flex-1 flex flex-col w-full max-w-4xl mx-auto shadow-lg border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-sans font-semibold">
            <Bot className="w-5 h-5 text-cortex-primary" />
            Cortex Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {chatState.messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8 animate-fade-in">
                  <BrainCircuit className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>How can I help you explore your knowledge today?</p>
                </div>
              )}
              {chatState.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && <Bot className="w-6 h-6 text-cortex-primary flex-shrink-0 mt-1" />}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-cortex-primary text-white' : 'bg-muted'}`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    {msg.toolCalls && (
                      <div className="mt-3 pt-2 border-t border-current/20 space-y-2">
                        {msg.toolCalls.map((tool, idx) => (
                          <Badge key={idx} variant={msg.role === 'user' ? 'secondary' : 'outline'} className="text-xs font-mono">
                            <Wrench className="w-3 h-3 mr-1.5" /> {renderToolCall(tool)}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-60 mt-2 text-right">{formatTime(msg.timestamp)}</p>
                  </div>
                  {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />}
                </motion.div>
              ))}
              {chatState.streamingMessage && (
                <div className="flex items-start gap-3 justify-start">
                  <Bot className="w-6 h-6 text-cortex-primary flex-shrink-0 mt-1" />
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-muted">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{chatState.streamingMessage}<span className="animate-pulse">|</span></p>
                  </div>
                </div>
              )}
              {chatState.isProcessing && !chatState.streamingMessage && (
                <div className="flex items-start gap-3 justify-start">
                  <Bot className="w-6 h-6 text-cortex-primary flex-shrink-0 mt-1" />
                  <div className="px-4 py-3 rounded-2xl bg-muted flex items-center gap-2">
                    <span className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                    <span className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border/50">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); }}
                placeholder="Ask about your knowledge..."
                className="w-full pr-12 resize-none"
                rows={1}
                disabled={chatState.isProcessing}
              />
              <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" disabled={!input.trim() || chatState.isProcessing}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>AI responses may be rate limited.</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>There is a limit on the number of requests that can be made to the AI servers across all user apps in a given time period.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}