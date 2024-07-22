import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Github, Twitter, Zap, Star, Coffee } from "lucide-react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    fetchStories();
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = await response.json();
      const topStories = await Promise.all(
        storyIds.slice(0, 100).map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        )
      );
      setStories(topStories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  const toggleFavorite = (story) => {
    const isFavorite = favorites.some(fav => fav.id === story.id);
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== story.id);
    } else {
      updatedFavorites = [...favorites, story];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStories = (storiesToRender) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {storiesToRender.map((story, index) => (
        <Card key={story.id} className="w-full bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-primary">
          <CardHeader className={`bg-gradient-to-r ${index % 7 === 0 ? 'from-red-600 via-orange-500 to-yellow-400' : 
                                                     index % 7 === 1 ? 'from-yellow-400 via-green-500 to-teal-400' :
                                                     index % 7 === 2 ? 'from-teal-400 via-blue-500 to-indigo-400' :
                                                     index % 7 === 3 ? 'from-indigo-400 via-purple-500 to-pink-400' :
                                                     index % 7 === 4 ? 'from-pink-400 via-red-500 to-orange-400' :
                                                     index % 7 === 5 ? 'from-orange-400 via-yellow-500 to-green-400' :
                                                     'from-green-400 via-teal-500 to-blue-400'}`}>
            <CardTitle className="text-white">{story.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary font-bold">Upvotes: {story.score}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedStory(story)} className="bg-primary text-primary-foreground hover:bg-primary/90">Read More</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] bg-background border-4 border-primary">
                <DialogHeader>
                  <DialogTitle className="text-primary">{selectedStory?.title}</DialogTitle>
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
              className={favorites.some(fav => fav.id === story.id) ? "text-primary" : "text-muted-foreground"}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      <div className="container mx-auto bg-card p-6 rounded-lg shadow-lg flex-grow my-8 border-4 border-primary">
        <h1 className="text-5xl font-bold mb-4 text-primary">Top 100 Hacker News Stories</h1>
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 bg-input text-foreground placeholder-muted-foreground border-2 border-primary"
        />
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Stories</TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(12)].map((_, index) => (
                  <Card key={index} className="w-full bg-card">
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4 bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2 bg-muted" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-1/4 bg-muted" />
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
      <footer className="bg-card text-card-foreground py-12 rounded-lg mt-8 border-t-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-primary mb-4">Hacker News Reader</h2>
              <p className="text-muted-foreground">Stay updated with the latest tech news</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Home</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-2xl font-bold text-primary mb-4">Follow Us</h3>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  <Github className="w-8 h-8" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  <Twitter className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary text-center">
            <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Hacker News Reader. All rights reserved.</p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
            <Star className="w-6 h-6 text-primary animate-spin-slow" />
            <Coffee className="w-6 h-6 text-primary animate-bounce" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;