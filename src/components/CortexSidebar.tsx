import { NavLink, useNavigate } from 'react-router-dom';
import { BrainCircuit, Sparkles, FolderKanban, User, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';
const navItems = [
  { to: '/app', icon: BrainCircuit, label: 'Neural View' },
  { to: '/app/search', icon: Sparkles, label: 'AI Search' },
  { to: '/app/cortex', icon: FolderKanban, label: 'Content Cortex' },
];
const bottomNavItems = [
  { to: '/app/profile', icon: User, label: 'Profile' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];
export function CortexSidebar() {
  const navigate = useNavigate();
  const logout = useAppStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const activeLinkClass = "bg-cortex-primary/10 text-cortex-primary dark:bg-cortex-primary/20";
  const inactiveLinkClass = "text-muted-foreground hover:bg-muted hover:text-foreground";
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-background border-r border-border/50 p-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2.5 px-2 mb-8"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cortex-primary to-purple-500 flex items-center justify-center">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-display font-bold text-foreground">Cortex</h1>
      </motion.div>
      <nav className="flex-1 flex flex-col justify-between">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <NavLink
                to={item.to}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium',
                    isActive ? activeLinkClass : inactiveLinkClass
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
        <div>
          <ul className="space-y-2">
            {bottomNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium',
                      isActive ? activeLinkClass : inactiveLinkClass
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-border/50">
            <button
              onClick={handleLogout}
              className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium', inactiveLinkClass)}
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}