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
        <Card key={story.id} className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className={`bg-gradient-to-r ${index % 6 === 0 ? 'from-red-200 to-orange-200' : 
                                                     index % 6 === 1 ? 'from-yellow-200 to-green-200' :
                                                     index % 6 === 2 ? 'from-green-200 to-blue-200' :
                                                     index % 6 === 3 ? 'from-blue-200 to-indigo-200' :
                                                     index % 6 === 4 ? 'from-indigo-200 to-purple-200' :
                                                     'from-purple-200 to-pink-200'}`}>
            <CardTitle className="text-gray-800">{story.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Upvotes: {story.score}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedStory(story)} className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white">Read More</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{selectedStory?.title}</DialogTitle>
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
              className={favorites.some(fav => fav.id === story.id) ? "text-red-500" : "text-gray-500"}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 via-yellow-100 to-blue-100 flex flex-col">
      <div className="container mx-auto bg-white bg-opacity-80 p-6 rounded-lg shadow-lg flex-grow my-8">
        <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Top 100 Hacker News Stories</h1>
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-gradient-to-r from-indigo-200 to-purple-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">All Stories</TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-white data-[state=active]:text-purple-600">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(12)].map((_, index) => (
                  <Card key={index} className="w-full bg-white">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-1/4" />
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
      <footer className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">Hacker News Reader</h2>
              <p className="mt-2">Stay updated with the latest tech news</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Hacker News Reader. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;