import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Github, Twitter, Zap, Star, Coffee } from "lucide-react";

const Index = () => {
  // ... (previous state and effect hooks remain the same)

  const renderStories = (storiesToRender) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {storiesToRender.map((story, index) => (
        <Card key={story.id} className="w-full bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-neon-pink">
          <CardHeader className={`bg-gradient-to-r ${index % 7 === 0 ? 'from-red-600 via-orange-500 to-yellow-400' : 
                                                     index % 7 === 1 ? 'from-yellow-400 via-green-500 to-teal-400' :
                                                     index % 7 === 2 ? 'from-teal-400 via-blue-500 to-indigo-400' :
                                                     index % 7 === 3 ? 'from-indigo-400 via-purple-500 to-pink-400' :
                                                     index % 7 === 4 ? 'from-pink-400 via-red-500 to-orange-400' :
                                                     index % 7 === 5 ? 'from-orange-400 via-yellow-500 to-green-400' :
                                                     'from-green-400 via-teal-500 to-blue-400'}`}>
            <CardTitle className="text-white text-shadow-neon">{story.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neon-blue font-bold text-shadow-neon">Upvotes: {story.score}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedStory(story)} className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue hover:from-neon-blue hover:via-neon-purple hover:to-neon-pink text-white font-bold shadow-neon">Read More</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-4 border-neon-purple">
                <DialogHeader>
                  <DialogTitle className="text-neon-green text-shadow-neon">{selectedStory?.title}</DialogTitle>
                </DialogHeader>
                <div className="w-full h-[calc(90vh-100px)]">
                  {selectedStory && (
                    <iframe
                      src={selectedStory.url}
                      title={selectedStory.title}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              onClick={() => toggleFavorite(story)}
              className={favorites.some(fav => fav.id === story.id) ? "text-neon-pink" : "text-neon-blue"}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 flex flex-col p-4">
      <div className="container mx-auto bg-gradient-to-tr from-fuchsia-900 via-purple-800 to-indigo-900 p-6 rounded-lg shadow-neon flex-grow my-8 border-4 border-neon-blue">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue animate-pulse">Top 100 Hacker News Stories</h1>
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 bg-gradient-to-r from-indigo-800 to-purple-800 text-neon-green placeholder-neon-blue placeholder-opacity-50 border-2 border-neon-purple"
        />
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-gradient-to-r from-indigo-800 to-purple-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-pink data-[state=active]:to-neon-purple data-[state=active]:text-white">All Stories</TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-blue data-[state=active]:to-neon-green data-[state=active]:text-white">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(12)].map((_, index) => (
                  <Card key={index} className="w-full bg-gradient-to-br from-fuchsia-800 via-purple-700 to-indigo-800">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4 bg-neon-purple bg-opacity-50" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2 bg-neon-blue bg-opacity-50" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-1/4 bg-neon-pink bg-opacity-50" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              renderStories(filteredStories)
            )}
          </TabsContent>
          <TabsContent value="favorites">
            {renderStories(favorites.filter(story =>
              story.title.toLowerCase().includes(searchTerm.toLowerCase())
            ))}
          </TabsContent>
        </Tabs>
      </div>
      <footer className="bg-gradient-to-r from-black via-purple-900 to-indigo-900 text-white py-12 rounded-lg mt-8 border-t-4 border-neon-purple">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue mb-4">Hacker News Reader</h2>
              <p className="text-neon-green">Stay updated with the latest tech news</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-neon-blue mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neon-pink hover:text-neon-green transition-colors duration-200">Home</a></li>
                <li><a href="#" className="text-neon-pink hover:text-neon-green transition-colors duration-200">About</a></li>
                <li><a href="#" className="text-neon-pink hover:text-neon-green transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-2xl font-bold text-neon-green mb-4">Follow Us</h3>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:text-neon-pink transition-colors duration-200">
                  <Github className="w-8 h-8" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:text-neon-pink transition-colors duration-200">
                  <Twitter className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neon-purple text-center">
            <p className="text-neon-purple">&copy; {new Date().getFullYear()} Hacker News Reader. All rights reserved.</p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <Zap className="w-6 h-6 text-neon-yellow animate-pulse" />
            <Star className="w-6 h-6 text-neon-orange animate-spin-slow" />
            <Coffee className="w-6 h-6 text-neon-green animate-bounce" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;