import React, { useState } from 'react';
import { ArrowLeft, X, Plus, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';

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
  const [iframeErrors, setIframeErrors] = useState<Set<string>>(new Set());
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

  const handleIframeError = (tabId: string) => {
    setIframeErrors(prev => new Set([...prev, tabId]));
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
          iframeErrors.has(activeTab.id) ? (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
              <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Blocked</h2>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {activeTab.title} doesn't allow embedding in frames for security reasons. 
                You can open it in a new browser tab instead.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => openInNewTab(activeTab.url)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open in New Tab</span>
                </button>
                <p className="text-sm text-gray-500 text-center">
                  URL: <span className="font-mono">{activeTab.url}</span>
                </p>
              </div>
            </div>
          ) : (
            <iframe
              src={activeTab.url}
              className="w-full h-full border-0"
              title={activeTab.title}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
              onError={() => handleIframeError(activeTab.id)}
              onLoad={(e) => {
                const iframe = e.target as HTMLIFrameElement;
                try {
                  // Test if we can access the iframe content
                  iframe.contentWindow?.location.href;
                } catch (error) {
                  // If we can't access it, it's likely blocked by X-Frame-Options
                  handleIframeError(activeTab.id);
                }
              }}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No active tab</p>
          </div>
        )}
      </div>
    </div>
  );
};