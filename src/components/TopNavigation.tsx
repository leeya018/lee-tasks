import { NavLink } from '@/components/NavLink';
import { CheckSquare, FileText } from 'lucide-react';
import { SettingsPanel } from '@/components/SettingsPanel';

interface TopNavigationProps {
  onClearAllData?: () => void;
}

export function TopNavigation({ onClearAllData }: TopNavigationProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground bg-accent"
            >
              <CheckSquare className="h-4 w-4" />
              Daily Tasks
            </NavLink>
            <NavLink
              to="/prompts"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground bg-accent"
            >
              <FileText className="h-4 w-4" />
              Prompts
            </NavLink>
          </nav>
          {onClearAllData && <SettingsPanel onClearAllData={onClearAllData} />}
        </div>
      </div>
    </header>
  );
}
