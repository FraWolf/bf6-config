import { useState } from "react";

interface ConfigEditorProps {
  configData: Record<string, any>;
  fileName: string;
  onBack: () => void;
  onSave: (data: Record<string, any>) => void;
}

const CONFIG_CATEGORIES = {
  Graphics: [
    "GstRender.Dx11Enable",
    "GstRender.ResolutionWidth",
    "GstRender.ResolutionHeight",
    "GstRender.FullscreenEnabled",
    "GstRender.VSyncEnabled",
    "GstRender.FramerateLimiter",
  ],
  Audio: [
    "GstAudio.MasterVolume",
    "GstAudio.MusicVolume",
    "GstAudio.EffectsVolume",
    "GstAudio.VoiceVolume",
  ],
  Gameplay: [
    "GstGameplay.MouseSensitivity",
    "GstGameplay.InvertY",
    "GstGameplay.FOV",
    "GstGameplay.AimAssist",
  ],
  Network: ["GstNetwork.MaxPing", "GstNetwork.TickRate", "GstNetwork.Region"],
};

export default function ConfigEditor({
  configData,
  fileName,
  onBack,
  onSave,
}: ConfigEditorProps) {
  const [config, setConfig] = useState(configData);
  const [activeCategory, setActiveCategory] = useState<string>("Graphics");
  const [searchQuery, setSearchQuery] = useState("");

  const handleValueChange = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onSave(newConfig);
  };

  const handleExport = () => {
    const configText = Object.entries(config)
      .map(([key, value]) => `${key} "${value}"`)
      .join("\n");

    const blob = new Blob([configText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "config.cfg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = Object.entries(config).filter(
    ([key, value]) =>
      key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryEntries = (category: string) => {
    const keys =
      CONFIG_CATEGORIES[category as keyof typeof CONFIG_CATEGORIES] || [];
    return Object.entries(config).filter(([key]) =>
      keys.some((k) => key.includes(k))
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-card border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-secondary transition-colors border border-border"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  CONFIG EDITOR
                </h1>
                <p className="text-xs text-muted-foreground">{fileName}</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-primary text-primary-foreground font-bold text-sm tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-2 border border-primary/50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3">
            <div className="bg-card border border-border sticky top-6">
              <div className="p-4 border-b border-border">
                <h2 className="text-xs font-bold tracking-widest text-muted-foreground">
                  CATEGORIES
                </h2>
              </div>
              <nav className="p-2">
                {Object.keys(CONFIG_CATEGORIES).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`
                      w-full text-left px-3 py-2 text-sm font-semibold transition-colors
                      ${
                        activeCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
                <div className="my-2 h-px bg-border" />
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`
                    w-full text-left px-3 py-2 text-sm font-semibold transition-colors
                    ${
                      activeCategory === "All"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }
                  `}
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
                  className="w-full px-4 py-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
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
            <div className="bg-card border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground">
                  {searchQuery
                    ? "SEARCH RESULTS"
                    : activeCategory.toUpperCase()}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {searchQuery
                    ? filteredEntries.length
                    : activeCategory === "All"
                    ? Object.keys(config).length
                    : getCategoryEntries(activeCategory).length}{" "}
                  SETTINGS
                </span>
              </div>
              <div className="divide-y divide-border">
                {(searchQuery
                  ? filteredEntries
                  : activeCategory === "All"
                  ? Object.entries(config)
                  : getCategoryEntries(activeCategory)
                ).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm font-semibold text-foreground mb-1 font-mono">
                          {key}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Configuration parameter
                        </p>
                      </div>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleValueChange(key, e.target.value)}
                        className="w-64 px-3 py-2 bg-input border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                ))}
                {(searchQuery
                  ? filteredEntries
                  : activeCategory === "All"
                  ? Object.entries(config)
                  : getCategoryEntries(activeCategory)
                ).length === 0 && (
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
