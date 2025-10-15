import { useMemo, useState } from 'react';
import type { ConfigEditorProps } from '@/typings';
import { tw } from '@/utils/merge';

export default function ConfigEditor({ configData, fileName, onBack, onSave }: ConfigEditorProps) {
  const [config, setConfig] = useState(configData);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleValueChange = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onSave(newConfig);
  };

  const categories = useMemo(() => {
    if (!config) {
      return [];
    }

    const configKeys = Object.keys(config);
    setActiveCategory(configKeys?.[0]);
    return configKeys;
  }, [config]);

  const allValues = useMemo(() => {
    const flattedValues = Object.values(config).flatMap((item) => {
      return Object.entries(item);
    });

    return Object.fromEntries(flattedValues);
  }, [config]);

  const handleExport = () => {
    const configText = Object.entries(config)
      .map(([key, value]) => `${key} "${value}"`)
      .join('\n');

    const blob = new Blob([configText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'config.cfg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = useMemo(() => {
    if (!config || !searchQuery || !activeCategory) {
      return [];
    }

    const searchCategory = activeCategory === 'All' ? allValues : config?.[activeCategory];
    return Object.entries(searchCategory).filter(([key, value]) => {
      return (
        key.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        String(value).toLowerCase().includes(searchQuery?.toLowerCase())
      );
    });
  }, [config, searchQuery, activeCategory]);

  const getCategoryEntries = (category: string) => {
    if (!category) {
      return [];
    }

    if (category === 'All') {
      return Object.entries(allValues);
    }

    return Object.entries(config[category]);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-card border-border border-b-2">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="hover:bg-secondary border-border border p-2 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold tracking-tight">CONFIG EDITOR</h1>
                <p className="text-muted-foreground text-xs">{fileName}</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary/50 flex items-center gap-2 border px-4 py-2 text-sm font-bold tracking-wider transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              EXPORT
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3">
            <div className="bg-card border-border sticky top-6 border">
              <div className="border-border border-b p-4">
                <h2 className="text-muted-foreground text-xs font-bold tracking-widest">CATEGORIES</h2>
              </div>
              <nav className="p-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={tw('w-full px-3 py-2 text-left text-sm font-semibold transition-colors', {
                      'bg-primary text-primary-foreground': activeCategory === category,
                      'text-foreground hover:bg-secondary': activeCategory !== category
                    })}
                  >
                    {category}
                  </button>
                ))}
                <div className="bg-border my-2 h-px" />
                <button
                  onClick={() => setActiveCategory('All')}
                  className={tw('w-full px-3 py-2 text-left text-sm font-semibold transition-colors', {
                    'bg-primary text-primary-foreground': activeCategory === 'All',
                    'text-foreground hover:bg-secondary': activeCategory !== 'All'
                  })}
                >
                  All Settings
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-9">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-ring w-full border px-4 py-3 focus:ring-2 focus:outline-none"
                />
                <svg
                  className="text-muted-foreground absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="bg-card border-border border">
              <div className="border-border flex items-center justify-between border-b p-4">
                <h2 className="text-muted-foreground text-sm font-bold tracking-widest">
                  {searchQuery ? 'SEARCH RESULTS' : activeCategory?.toUpperCase()}
                </h2>
                <span className="text-muted-foreground text-xs">
                  {searchQuery ? filteredEntries.length : getCategoryEntries(activeCategory).length} SETTINGS
                </span>
              </div>
              <div className="divide-border divide-y">
                {(searchQuery ? filteredEntries : getCategoryEntries(activeCategory)).map(([key, value]) => (
                  <div key={key} className="hover:bg-secondary/50 p-4 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <label className="text-foreground mb-1 block font-mono text-sm font-semibold">{key}</label>
                        <p className="text-muted-foreground text-xs">Configuration parameter</p>
                      </div>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleValueChange(key, e.target.value)}
                        className="bg-input border-border text-foreground focus:ring-ring w-64 border px-3 py-2 font-mono text-sm focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
                {(searchQuery ? filteredEntries : getCategoryEntries(activeCategory)).length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">No settings found</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
