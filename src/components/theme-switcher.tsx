"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const themes = [
        { name: "light", icon: Sun, label: "Light" },
        { name: "dark", icon: Moon, label: "Dark" },
        { name: "system", icon: Monitor, label: "System" },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
                const isActive = theme === t.name;
                return (
                    <button
                        key={t.name}
                        onClick={() => setTheme(t.name)}
                        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-accent/50 ${isActive
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border/50 text-muted-foreground"
                            }`}
                    >
                        <t.icon className="h-5 w-5" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">
                            {t.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
