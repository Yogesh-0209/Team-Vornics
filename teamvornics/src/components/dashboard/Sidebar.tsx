import React from 'react';
import { 
  Upload, 
  Clock, 
  FileText, 
  History, 
  BarChart3, 
  Settings,
  Ship,
  Home,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  DollarSign // New icon for calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Dashboard home' },
    { id: 'upload', label: 'Upload', icon: Upload, description: 'Process new documents' },
    { id: 'processing', label: 'Processing', icon: Clock, description: 'Monitor active jobs' },
    { id: 'results', label: 'Results', icon: FileText, description: 'View extracted data' },
    { id: 'history', label: 'History', icon: History, description: 'Browse past files' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Insights & trends' },
    { id: 'demurrage-calculator', label: 'Demurrage Calc', icon: DollarSign, description: 'Calculate charges' }, // New menu item
    { id: 'settings', label: 'Settings', icon: Settings, description: 'System configuration' },
  ];

  return (
    <div className={`${collapsed ? 'w-16' : 'w-72'} bg-white shadow-xl flex flex-col transition-all duration-300 fixed h-full z-30 border-r border-gray-200`}>
      {/* Header */}
      <div className={`${collapsed ? 'p-4' : 'p-6'} border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600`}>
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Ship className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Ship className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SoF Extractor</h1>
                <p className="text-sm text-blue-100">Laytime Intelligence</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 z-40"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-600" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-600" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center ${collapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-3 text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group`}
            title={collapsed ? 'Back to Home' : ''}
          >
            <Home className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Back to Home</span>}
          </button>
          
          <div className={`${collapsed ? 'hidden' : 'block'} py-2`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
              Main Menu
            </p>
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center ${collapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600'
                }`}
                title={collapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <span className="font-medium">{item.label}</span>
                    <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'} mt-0.5`}>
                      {item.description}
                    </p>
                  </div>
                )}
                
                {isActive && !collapsed && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Help Section */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Need Help?</h3>
              </div>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Access guides, tutorials, and support resources.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group">
              View Documentation
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed Help Icon */}
      {collapsed && (
        <div className="p-4 border-t border-gray-200">
          <button
            className="w-full flex justify-center p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
            title="Help & Documentation"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
