import React, { useState } from 'react';
import { ArrowLeft, X, Plus, RefreshCw } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

interface BrowserTabsProps {
  tabs: Tab[];
  onCloseTab: (tabId: string) => void;
  onBackToDashboard: () => void;
  onTabChange: (tabs: Tab[]) => void;
}

export const BrowserTabs: React.FC<BrowserTabsProps> = ({
  tabs,
  onCloseTab,
  onBackToDashboard,
  onTabChange
}) => {
  const activeTab = tabs.find(tab => tab.active);

  const handleTabClick = (tabId: string) => {
    const updatedTabs = tabs.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }));
    onTabChange(updatedTabs);
  };

  const refreshTab = () => {
    if (activeTab) {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = iframe.src;
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Browser Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center px-4 py-2 space-x-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          {activeTab && (
            <button
              onClick={refreshTab}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-gray-50 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center min-w-0 max-w-xs ${
                tab.active ? 'bg-white border-t-2 border-t-blue-500' : 'hover:bg-gray-100'
              } transition-colors cursor-pointer`}
              onClick={() => handleTabClick(tab.id)}
            >
              <div className="flex items-center space-x-2 px-4 py-3 min-w-0 flex-1">
                <span className="text-sm font-medium truncate">{tab.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="p-1 mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 bg-white">
        {activeTab ? (
          <iframe
            src={activeTab.url}
            className="w-full h-full border-0"
            title={activeTab.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No active tab</p>
          </div>
        )}
      </div>
    </div>
  );
};