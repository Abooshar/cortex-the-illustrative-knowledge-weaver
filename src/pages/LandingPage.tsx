import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, Shield, Layers, CheckCircle, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
const featureCards = [
  { icon: <BrainCircuit className="w-8 h-8 text-cortex-primary" />, title: 'Build Your Second Brain', description: 'Visually map your thoughts, projects, and ideas. See the bigger picture and uncover novel connections.' },
  { icon: <Zap className="w-8 h-8 text-cortex-primary" />, title: 'Instant AI Recall', description: 'Query your entire knowledge base with natural language. Get answers, not just search results.' },
  { icon: <Layers className="w-8 h-8 text-cortex-primary" />, title: 'Flexible Organization', description: 'Structure your information your way with tables, grids, lists, and interactive Kanban boards.' },
  { icon: <Shield className="w-8 h-8 text-cortex-primary" />, title: 'Private by Design', description: 'Your knowledge is yours alone. Built on Cloudflare with privacy as a first principle.' },
];
const testimonials = [
  { name: 'Dr. Anya Sharma', role: 'Lead Researcher', quote: 'Cortex has revolutionized my research workflow. The ability to visually connect disparate data points has led to breakthroughs I never anticipated.' },
  { name: 'Marcus Chen', role: 'Principal Engineer', quote: 'I use Cortex as my personal knowledge repository for complex systems. The AI search is like having a conversation with my own notes—it\'s incredibly powerful.' },
  { name: 'Sofia Rossi', role: 'Novelist & World-builder', quote: 'Mapping out character arcs and plotlines in the neural view is a dream. Cortex is an essential tool for any creative professional.' },
];
const pricingTiers = [
    {
        name: 'Hobbyist',
        price: '$0',
        description: 'For curious minds starting their knowledge journey.',
        features: ['1 Knowledge Graph', '500 Nodes', 'Basic AI Search', 'Community Support'],
        isFeatured: false,
    },
    {
        name: 'Thinker',
        price: '$12',
        description: 'For professionals and creators building their second brain.',
        features: ['Unlimited Graphs', 'Unlimited Nodes', 'Advanced AI Search', 'Priority Support', 'Import from Notion & Markdown'],
        isFeatured: true,
    },
    {
        name: 'Architect',
        price: '$25',
        description: 'For teams and power-users architecting shared knowledge.',
        features: ['All Thinker features', 'Team Collaboration', 'API Access', 'Dedicated Support'],
        isFeatured: false,
    },
];
const faqItems = [
    { q: 'What is Cortex?', a: 'Cortex is an AI-powered knowledge management system that helps you organize and visualize your information as an interactive, illustrative neural network, effectively creating a "second brain".' },
    { q: 'Who is Cortex for?', a: 'Cortex is for anyone who wants to better understand and connect their ideas - researchers, developers, writers, students, and lifelong learners who want to augment their thinking.' },
    { q: 'Is my data secure?', a: 'Absolutely. Security is our top priority. Your data is stored securely and is never used for training models. The application is built on the robust Cloudflare infrastructure.' },
    { q: 'Can I import my existing notes?', a: 'Yes! Our "Thinker" plan and above allows you to import from popular formats like Markdown and from services like Notion, so you can build your second brain from your existing knowledge.' },
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
                Your Second Brain, Visualized.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Cortex connects your ideas into a beautiful, explorable neural network. Stop searching, start discovering.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg" className="bg-cortex-primary hover:bg-cortex-primary/90 text-white shadow-lg shadow-cortex-primary/30">
                  <Link to="/app">Build Your Brain for Free <ChevronRight className="w-4 h-4 ml-2" /></Link>
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
        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-muted/50 dark:bg-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-display font-bold">Find the Plan for Your Brain</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Start for free, then upgrade as your knowledge grows.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3 items-center">
                    {pricingTiers.map((tier) => (
                        <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
                            <Card className={cn("h-full p-6 border-border/50 transition-all duration-300", tier.isFeatured && "border-cortex-primary shadow-2xl shadow-cortex-primary/20 -translate-y-2")}>
                                <CardHeader className="p-0">
                                    {tier.isFeatured && <div className="text-cortex-primary font-semibold mb-2 flex items-center gap-2"><Star className="w-4 h-4" /> Most Popular</div>}
                                    <CardTitle className="text-2xl font-sans font-bold">{tier.name}</CardTitle>
                                    <p className="text-muted-foreground mt-2">{tier.description}</p>
                                    <div className="my-6">
                                        <span className="text-5xl font-bold">{tier.price}</span>
                                        {tier.price !== '$0' && <span className="text-muted-foreground">/ month</span>}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ul className="space-y-3">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild size="lg" className={cn("w-full mt-8", tier.isFeatured ? "bg-cortex-primary hover:bg-cortex-primary/90 text-white" : "bg-primary/10 text-primary hover:bg-primary/20")}>
                                        <Link to="/app">Get Started</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
        {/* Testimonials Section */}
        <section className="py-20">
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
        <section className="py-20 bg-muted/50 dark:bg-white/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full mt-12">
              {faqItems.map((item, i) => (
                <AccordionItem value={`item-${i}`} key={i}>
                  <AccordionTrigger className="text-lg font-semibold text-left">{item.q}</AccordionTrigger>
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