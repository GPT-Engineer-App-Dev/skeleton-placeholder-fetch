import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";

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
      {storiesToRender.map(story => (
        <Card key={story.id} className="w-full bg-white">
          <CardHeader>
            <CardTitle className="text-blue-800">{story.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600">Upvotes: {story.score}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedStory(story)} className="bg-blue-500 hover:bg-blue-600">Read More</Button>
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
              className={favorites.some(fav => fav.id === story.id) ? "text-red-500" : "text-blue-500"}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-100 p-4">
      <div className="container mx-auto bg-blue-200 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Top 100 Hacker News Stories</h1>
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-blue-300">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">All Stories</TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Favorites</TabsTrigger>
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
    </div>
  );
};

export default Index;