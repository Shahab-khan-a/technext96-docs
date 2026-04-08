"use client";

import React, { useState } from "react";
import Navebar from "./Navebar";
import Left from "./Left";
import RightSidebar from "./RightSidebar";

export default function ResponsiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
            <Navebar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 overflow-hidden relative">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Left Sidebar */}
                <aside className={`
          fixed inset-y-0 left-0 z-50 w-70 transition-transform duration-300 transform bg-black
          lg:relative lg:translate-x-0 lg:z-auto lg:w-[320px]
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
                    <Left onItemClick={() => setIsSidebarOpen(false)} />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 h-full overflow-y-auto bg-black scroll-smooth">
                    {children}
                </main>

                {/* Right Sidebar */}
                <aside className="hidden xl:block w-75 h-full shrink-0">
                    <RightSidebar />
                </aside>
            </div>
        </div>
    );
}
