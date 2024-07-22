import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Github, Twitter } from "lucide-react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStoryIds = await topStoriesRes.json();
        const top100Ids = topStoryIds.slice(0, 100);

        const storyPromises = top100Ids.map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );

        const fetchedStories = await Promise.all(storyPromises);
        setStories(fetchedStories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setLoading(false);
      }
    };

    fetchStories();
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (story) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(fav => fav.id === story.id)) {
        return prevFavorites.filter(fav => fav.id !== story.id);
      } else {
        return [...prevFavorites, story];
      }
    });
  };

  const renderStories = (storiesToRender) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {storiesToRender.map((story, index) => (
        <Card key={story.id} className="w-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className={`bg-gradient-to-r ${index % 7 === 0 ? 'from-red-500 to-orange-500' : 
                                                     index % 7 === 1 ? 'from-orange-500 to-yellow-500' :
                                                     index % 7 === 2 ? 'from-yellow-500 to-green-500' :
                                                     index % 7 === 3 ? 'from-green-500 to-teal-500' :
                                                     index % 7 === 4 ? 'from-teal-500 to-blue-500' :
                                                     index % 7 === 5 ? 'from-blue-500 to-indigo-500' :
                                                     'from-indigo-500 to-purple-500'}`}>
            <CardTitle className="text-white text-shadow">{story.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white font-bold">Upvotes: {story.score}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedStory(story)} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold">Read More</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
                <DialogHeader>
                  <DialogTitle className="text-white">{selectedStory?.title}</DialogTitle>
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
              className={favorites.some(fav => fav.id === story.id) ? "text-yellow-300" : "text-white"}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-yellow-400 to-blue-500 flex flex-col p-4">
      <div className="container mx-auto bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 p-6 rounded-lg shadow-lg flex-grow my-8">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300 animate-pulse">Top 100 Hacker News Stories</h1>
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 text-white placeholder-indigo-200"
        />
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-gradient-to-r from-green-400 to-blue-500">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white">All Stories</TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(12)].map((_, index) => (
                  <Card key={index} className="w-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4 bg-white bg-opacity-50" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2 bg-white bg-opacity-50" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-1/4 bg-white bg-opacity-50" />
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
      <footer className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 rounded-lg mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">Hacker News Reader</h2>
              <p className="mt-2 text-indigo-200">Stay updated with the latest tech news</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors duration-200">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-indigo-200">&copy; {new Date().getFullYear()} Hacker News Reader. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;