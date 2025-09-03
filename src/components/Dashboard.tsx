import React, { useState, useEffect } from 'react';
import { LogOut, Settings, Users, BarChart3, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AdminPanel } from './AdminPanel';
import { BrowserTabs } from './BrowserTabs';
import { WelcomePopup } from './WelcomePopup';
import { db } from '../services/database';
import { Website } from '../types';

export const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [activeTabs, setActiveTabs] = useState<Array<{ id: string; title: string; url: string; active: boolean }>>([]);

  useEffect(() => {
    const sites = db.getWebsites();
    setWebsites(sites);
  }, []);

  const openWebsite = (website: Website) => {
    const existingTab = activeTabs.find(tab => tab.url === website.url);
    
    if (existingTab) {
      setActiveTabs(tabs => 
        tabs.map(tab => ({ ...tab, active: tab.id === existingTab.id }))
      );
    } else {
      const newTab = {
        id: `tab-${Date.now()}`,
        title: website.name,
        url: website.url,
        active: true
      };
      
      setActiveTabs(tabs => [
        ...tabs.map(tab => ({ ...tab, active: false })),
        newTab
      ]);
    }
  };

  const closeTab = (tabId: string) => {
    setActiveTabs(tabs => {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      if (newTabs.length > 0 && tabs.find(tab => tab.id === tabId)?.active) {
        newTabs[newTabs.length - 1].active = true;
      }
      return newTabs;
    });
  };

  const userWebsites = websites.filter(site => 
    state.user?.permissions.includes(site.id)
  );

  if (activeTabs.length > 0) {
    return (
      <BrowserTabs
        tabs={activeTabs}
        onCloseTab={closeTab}
        onBackToDashboard={() => setActiveTabs([])}
        onTabChange={setActiveTabs}
      />
    );
  }

  if (showAdmin && state.user?.role === 'admin') {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomePopup />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{state.user?.username}</span>
              </div>
              
              {state.user?.role === 'admin' && (
                <button
                  onClick={() => setShowAdmin(true)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Username:</span>
              <p className="font-medium">{state.user?.username}</p>
            </div>
            <div>
              <span className="text-gray-500">Role:</span>
              <p className="font-medium capitalize">{state.user?.role}</p>
            </div>
            <div>
              <span className="text-gray-500">Access Level:</span>
              <p className="font-medium">{state.user?.permissions.length} websites</p>
            </div>
          </div>
        </div>

        {/* Website Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Websites</h2>
          
          {userWebsites.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No websites available. Contact your administrator for access.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userWebsites.map((website) => (
                <div
                  key={website.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => openWebsite(website)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <img
                        src={website.logo}
                        alt={`${website.name} logo`}
                        className="w-12 h-12 object-contain rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzNCODJGNiIvPgo8dGV4dCB4PSIyNCIgeT0iMzIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj57e3dlYnNpdGUubmFtZVswXX19PC90ZXh0Pgo8L3N2Zz4K';
                        }}
                      />
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{website.name}</h3>
                    <p className="text-gray-600 text-sm">{website.description}</p>
                    
                    <div className="mt-4 pt-4 border-t">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Click to open
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};