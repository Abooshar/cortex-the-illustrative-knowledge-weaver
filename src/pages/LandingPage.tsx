import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, Shield, Layers, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ThemeToggle } from '@/components/ThemeToggle';
const featureCards = [
  { icon: <BrainCircuit className="w-8 h-8 text-cortex-primary" />, title: 'Neural Visualization', description: 'See your knowledge as an interconnected brain map. Discover hidden relationships instantly.' },
  { icon: <Zap className="w-8 h-8 text-cortex-primary" />, title: 'AI-Powered Search', description: 'Ask questions in natural language and get intelligent answers sourced directly from your content.' },
  { icon: <Layers className="w-8 h-8 text-cortex-primary" />, title: 'Content Cortex', description: 'Organize everything with powerful views: tables, grids, lists, and interactive Kanban boards.' },
  { icon: <Shield className="w-8 h-8 text-cortex-primary" />, title: 'Secure & Private', description: 'Your knowledge is yours alone. Built on Cloudflare with privacy as a first principle.' },
];
const testimonials = [
  { name: 'Elena Rodriguez', role: 'UX Researcher', quote: 'Cortex transformed how I synthesize research. The neural view is a game-changer for finding patterns.' },
  { name: 'Ben Carter', role: 'Software Developer', quote: 'I map out entire codebases in Cortex. It\'s my go-to for understanding complex systems.' },
  { name: 'Aisha Khan', role: 'Content Strategist', quote: 'The AI search saves me hours every week. It\'s like having a personal research assistant.' },
];
const faqItems = [
    { q: 'What is Cortex?', a: 'Cortex is an AI-powered knowledge management system that helps you organize and visualize your information as an interactive, illustrative neural network.' },
    { q: 'Who is Cortex for?', a: 'Cortex is for anyone who wants to better understand and connect their ideas - researchers, developers, writers, students, and lifelong learners.' },
    { q: 'Is my data secure?', a: 'Absolutely. Security is our top priority. Your data is stored securely and is never used for training models. The application is built on the robust Cloudflare infrastructure.' },
    { q: 'Can I import my existing notes?', a: 'Content import from various formats like Markdown and Notion is a high-priority feature on our roadmap. Stay tuned for updates!' },
];
export function LandingPage() {
  return (
    <div className="bg-cortex-light dark:bg-cortex-dark text-foreground min-h-screen overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-cortex-light/80 dark:bg-cortex-dark/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cortex-primary flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold">Cortex</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button asChild variant="ghost">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-cortex-primary hover:bg-cortex-primary/90 text-white">
                <Link to="/app">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 text-center relative">
           <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cortex-primary/20 opacity-20 blur-[100px]"></div></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-balance leading-tight">
                Weave Your Web of Knowledge
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Cortex is your second brain, an illustrative knowledge weaver that connects your ideas into a beautiful, explorable neural network.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg" className="bg-cortex-primary hover:bg-cortex-primary/90 text-white shadow-lg shadow-cortex-primary/30">
                  <Link to="/app">Start Weaving for Free <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold">A New Dimension of Thought</h2>
              <p className="mt-4 text-lg text-muted-foreground">Go beyond linear notes. Think in networks.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {featureCards.map((feature, i) => (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}>
                  <Card className="h-full text-center p-6 border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-center mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold font-sans">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="py-20 bg-muted/50 dark:bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold">Loved by Thinkers Everywhere</h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                 <motion.div key={testimonial.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}>
                    <Card className="h-full p-6 border-border/50">
                        <CardContent className="p-0">
                        <p className="italic">"{testimonial.quote}"</p>
                        <div className="mt-4 font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </CardContent>
                    </Card>
                 </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full mt-12">
              {faqItems.map((item, i) => (
                <AccordionItem value={`item-${i}`} key={i}>
                  <AccordionTrigger className="text-lg font-semibold">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cortex. All rights reserved.</p>
          <p className="text-sm mt-2">Built with ❤️ at Cloudflare</p>
        </div>
      </footer>
    </div>
  );
}