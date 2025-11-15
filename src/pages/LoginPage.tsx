import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCortexStore } from '@/stores/useCortexStore';
export function LoginPage() {
  const navigate = useNavigate();
  const login = useCortexStore((state) => state.login);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-cortex-light dark:bg-cortex-dark p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card className="w-full max-w-sm shadow-2xl border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-cortex-primary flex items-center justify-center mb-4">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-display">Welcome to Cortex</CardTitle>
            <CardDescription>Log in to weave your knowledge.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@example.com" defaultValue="demo@cortex.dev" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">
                Log In
              </Button>
              <p className="text-xs text-muted-foreground">
                This is a mock login. Any credentials will work.
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}