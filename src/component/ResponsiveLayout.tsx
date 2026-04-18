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
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
            <Navebar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Overlays */}
                {(isSidebarOpen || isRightSidebarOpen) && (
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => {
                            setIsSidebarOpen(false);
                            setIsRightSidebarOpen(false);
                        }}
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
                <aside className={`
                    fixed inset-y-0 right-0 z-50 w-75 transition-transform duration-300 transform bg-black border-l border-gray-800
                    xl:relative xl:translate-x-0 xl:z-auto xl:w-[320px]
                    ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0 pointer-events-none xl:pointer-events-auto"}
                `}>
                    <div className="h-full relative">
                        {/* Mobile Close Button */}
                        <button 
                            onClick={() => setIsRightSidebarOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white xl:hidden z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <RightSidebar onItemClick={() => setIsRightSidebarOpen(false)} />
                    </div>
                </aside>

                {/* Mobile Right Sidebar Toggle (Topics Button) */}
                {!isRightSidebarOpen && (
                <button
                    onClick={() => setIsRightSidebarOpen(true)}
                    className="fixed bottom-6 right-6 z-50 xl:hidden flex items-center gap-2 px-4 py-3 bg-amber-400 text-black font-bold rounded-full shadow-2xl shadow-amber-400/20 active:scale-95 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span>Topics</span>
                </button>
                )}
            </div>
        </div>
    );
}
