"use client";

import React, { useState, useEffect } from "react";
import { Folder, Search, ChevronDown, ChevronRight, BookOpen, Lightbulb, Users, BookText } from "lucide-react";
import { cn } from "../../lib/utils";
import Link from "next/link";

export type Topic = {
  id: number;
  name: string;
  subtopics: Subtopic[];
};

export type Subtopic = {
  id: number;
  name: string;
};

interface SidebarProps {
  topics: Topic[];
  selectedSubtopic?: number | null;
  onSubtopicSelect: (subtopicId: number) => void;
  className?: string;
  activePage?: string;
}

export default function Sidebar({
  topics,
  selectedSubtopic,
  onSubtopicSelect,
  className,
  activePage,
}: SidebarProps) {
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
    // Default expand first topic
    if (topics.length > 0) {
      setExpandedTopics({ [topics[0].id]: true });
    }
  }, [topics]);

  const toggleTopic = (topicId: number) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const filteredTopics = topics.filter((topic) => {
    const topicMatches = topic.name.toLowerCase().includes(searchQuery.toLowerCase());
    const subtopicMatches = topic.subtopics.some((subtopic) =>
      subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return topicMatches || subtopicMatches;
  });

  // Filter subtopics if search is active
  const getFilteredSubtopics = (topic: Topic) => {
    if (!searchQuery) return topic.subtopics;
    return topic.subtopics.filter((subtopic) =>
      subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getTopicIcon = (id: number) => {
    const icons = [
      <BookOpen key={1} className="h-4 w-4" />,
      <Folder key={2} className="h-4 w-4" />
    ];
    return icons[id % icons.length];
  };

  return (
    <div className={cn("w-64 border border-border bg-background p-5 rounded-xl", className)}>
      {/* Search input */}
      {isMounted && (
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-[50%] -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            className="w-full h-8 pl-8 pr-3 py-1.5 text-sm bg-secondary/50 border border-border rounded focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
          />
        </div>
      )}
      {!isMounted && <div className="mb-4 h-8"></div>}

      {/* Topics list */}
      <nav>
        {filteredTopics.map((topic) => {
          const filteredSubtopics = getFilteredSubtopics(topic);
          const isExpanded = !!expandedTopics[topic.id];
          
          return (
            <div key={topic.id} className="mb-3">
              <button
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-md text-left transition-all",
                  isExpanded 
                    ? "text-primary" 
                    : "text-foreground hover:bg-secondary/50"
                )}
                onClick={() => toggleTopic(topic.id)}
              >
                <div className="flex items-center">
                  <div className="w-5 flex items-center justify-center">
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="w-5 h-5 flex items-center justify-center mr-2 text-muted-foreground">
                    {getTopicIcon(topic.id)}
                  </div>
                  <span className="text-sm font-medium">{topic.name}</span>
                </div>
              </button>
              
              {isExpanded && filteredSubtopics.length > 0 && (
                <div className="ml-6 mt-1 text-sm space-y-0.5 animate-[slide-up_150ms_ease-out]">
                  {filteredSubtopics.map((subtopic) => {
                    const isActive = selectedSubtopic === subtopic.id;
                    
                    return (
                      <button
                        key={subtopic.id}
                        className={cn(
                          "group flex items-center p-1.5 rounded w-full text-left transition-all cursor-pointer",
                          isActive
                            ? "text-primary bg-secondary/60 font-medium"
                            : "text-foreground hover:bg-secondary/50"
                        )}
                        onClick={() => onSubtopicSelect(subtopic.id)}
                      >
                        <div className="w-4 h-4 flex items-center justify-center mr-1.5">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full flex-shrink-0",
                            isActive 
                              ? "bg-primary" 
                              : "bg-muted-foreground group-hover:bg-primary/70"
                          )}></div>
                        </div>
                        <span className="flex-1 text-sm">{subtopic.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      {/* Empty state */}
      {filteredTopics.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No topics found
        </div>
      )}
    </div>
  );
} 