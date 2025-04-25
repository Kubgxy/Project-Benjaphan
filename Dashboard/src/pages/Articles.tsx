
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  BookText,
  Eye,
  Check,
  X 
} from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Mock articles data
const mockArticles = [
  {
    id: 'A001',
    title: 'The Meaning Behind Lucky Dragon Pendants',
    excerpt: 'Discover the ancient symbolism and benefits of wearing a dragon pendant in daily life.',
    content: '# The Meaning Behind Lucky Dragon Pendants\n\nDragon pendants have been symbols of strength, prosperity, and good fortune in Asian cultures for centuries. In this article, we explore the rich history and symbolism behind these powerful amulets.\n\n## Historical Significance\n\nDragons have been revered in Eastern mythology as divine creatures that bring rain, prosperity, and good fortune. Unlike Western dragons, which are often depicted as evil, Eastern dragons are benevolent and wise.\n\n## Benefits of Wearing a Dragon Pendant\n\n- **Protection**: Dragons are believed to ward off evil spirits and negative energy\n- **Success**: They symbolize achievement and career advancement\n- **Prosperity**: Dragons are strongly associated with wealth and abundance\n- **Wisdom**: They represent intelligence and profound knowledge\n\n## How to Choose the Right Dragon Pendant\n\nWhen selecting a dragon pendant, consider these factors:\n\n1. **Material**: Gold represents wealth, while silver provides protection\n2. **Dragon Pose**: A coiled dragon offers protection, while a flying dragon brings opportunities\n3. **Color**: Green dragons relate to health, red to passion, and black to career success\n\n## Caring for Your Lucky Charm\n\nTo maintain the energy of your dragon pendant:\n\n- Cleanse it monthly under running water\n- Allow it to absorb moonlight during full moons\n- Avoid letting others touch your personal talisman\n\nEmbrace the ancient wisdom and protective energy of the dragon with one of our carefully crafted pendants.',
    category: 'Symbolism',
    tags: ['dragon', 'pendant', 'luck', 'protection'],
    author: 'Somsak Jaidee',
    publishedDate: new Date('2023-03-15'),
    status: 'published',
    featuredImage: 'https://example.com/images/dragon-pendant.jpg'
  },
  {
    id: 'A002',
    title: 'How to Place Lucky Bamboo for Maximum Feng Shui Benefits',
    excerpt: 'Learn the proper placement of lucky bamboo in your home or office to enhance positive energy flow.',
    content: '# How to Place Lucky Bamboo for Maximum Feng Shui Benefits\n\nLucky Bamboo (Dracaena sanderiana) is one of the most popular Feng Shui cures. Despite its name, it\'s not actually bamboo at all, but rather a member of the Dracaena family. Its association with good fortune and prosperity makes it a beloved addition to homes and offices worldwide.\n\n## The Significance of Stalks\n\nThe number of stalks in your lucky bamboo arrangement carries specific meanings:\n\n- **2 stalks**: Love and relationship harmony\n- **3 stalks**: Happiness, wealth, and long life\n- **5 stalks**: Five areas of life prosperity\n- **7 stalks**: Good health\n- **8 stalks**: Growth and abundance\n- **9 stalks**: Great fortune and success\n\n*Note: 4 stalks are generally avoided as the number four sounds like \"death\" in several Asian languages.*\n\n## Ideal Placement Locations\n\n### East Direction\nThe east represents family and health. Placing lucky bamboo in the eastern sector of your home or room promotes family harmony and overall well-being.\n\n### Southeast Direction\nThe southeast is connected to wealth and abundance. Lucky bamboo here can stimulate financial growth and opportunities.\n\n### North Direction\nThe north area relates to career and life path. Lucky bamboo in this location can enhance career prospects and professional growth.\n\n## Care Tips for Lucky Bamboo\n\n1. **Water**: Change the water every 1-2 weeks\n2. **Light**: Keep in indirect sunlight\n3. **Temperature**: Maintain between 65-90°F (18-32°C)\n4. **Avoid**: Direct sunlight and drafty locations\n\n## Special Arrangements\n\nFor specific goals, try these arrangements:\n\n- **Tower arrangement**: For career advancement\n- **Heart-shaped arrangement**: For love and relationship harmony\n- **Spiral arrangement**: For balanced energy and growth in all areas\n\nBy following these guidelines, your lucky bamboo will not only thrive but also maximize its potential to bring fortune and positive energy into your space.',
    category: 'Feng Shui',
    tags: ['bamboo', 'feng shui', 'placement'],
    author: 'Napat Wongsa',
    publishedDate: new Date('2023-02-20'),
    status: 'published',
    featuredImage: 'https://example.com/images/lucky-bamboo.jpg'
  },
  {
    id: 'A003',
    title: 'The Power of Wealth Frogs in Thai Tradition',
    excerpt: 'Explore how the three-legged wealth frog can attract prosperity and abundance to your home or business.',
    content: '# The Power of Wealth Frogs in Thai Tradition\n\nThe three-legged wealth frog, also known as the Money Toad or Chan Chu, is a powerful symbol of prosperity in Thai and Chinese traditions. These mythical creatures are believed to attract and protect wealth.\n\nIn this guide, we\'ll explore the history, meaning, and proper placement of wealth frogs to maximize their benefits.\n\n## Historical Origins\n\nThe wealth frog finds its origins in Chinese mythology. According to legend, Liu Hai, a minister from the 10th century, tamed a spirit in the form of a three-legged toad. This toad helped him recover lost coins from a well and became associated with money and wealth recovery.\n\nIn Thai tradition, these frogs have been adopted and incorporated into local belief systems around prosperity and good fortune.\n\n## Symbolic Meaning\n\nThe wealth frog carries several important symbolic elements:\n\n- **Three legs**: Represents the three types of luck - heaven luck (fate), human luck (actions), and earth luck (environment)\n- **Coin in mouth**: Symbolizes the attraction and protection of wealth\n- **Red eyes**: Wards off negative energies that might affect finances\n- **Sitting on gold ingots**: Amplifies wealth attraction properties\n\n## Proper Placement\n\n### Best Locations\n\n1. **Near the entrance**: Place facing inward to attract wealth into your home or business\n2. **Living room**: Position diagonally across from the main door\n3. **Office desk**: Place in the wealth corner (far left corner from the entrance)\n4. **Cash register**: For businesses, place near where money is handled\n\n### Important Rules\n\n- Never place in bathrooms, kitchens, or bedrooms\n- The frog should always face inward, never toward the door\n- Place on an elevated surface, never directly on the floor\n- Clean regularly with a soft cloth to maintain its energy\n\n## Types of Wealth Frogs\n\n- **Brass frogs**: Most traditional, good for stability\n- **Jade frogs**: Combine wealth and health benefits\n- **Crystal frogs**: Amplify energy and intention\n- **Golden frogs**: Most potent for financial prosperity\n\n## Activation Ritual\n\nTo activate your wealth frog:\n\n1. Clean it with clean water\n2. Place it in the sun for 1-2 hours\n3. Sprinkle some rice around it as an offering\n4. Place nine coins near it for 24 hours\n5. Position it in its permanent location\n\nBy following these guidelines, your wealth frog can become a powerful ally in attracting prosperity and abundance to your life.',
    category: 'Traditions',
    tags: ['frog', 'wealth', 'prosperity', 'feng shui'],
    author: 'Somsak Jaidee',
    publishedDate: new Date('2023-01-10'),
    status: 'published',
    featuredImage: 'https://example.com/images/wealth-frog.jpg'
  },
  {
    id: 'A004',
    title: 'Selecting the Perfect Jade For Protection',
    excerpt: 'Learn how to choose authentic jade pieces that offer maximum protective benefits.',
    content: '# Selecting the Perfect Jade For Protection\n\nJade has been revered for thousands of years across Asian cultures for its protective properties and connection to divine energy. In this article, we\'ll guide you through selecting authentic jade pieces that offer maximum protective benefits.\n\n## Understanding Jade Types\n\nWhat many people don\'t realize is that "jade" actually refers to two different minerals:\n\n### Jadeite\n- The more valuable and rarer form\n- Typically more vibrant green\n- Denser and more translucent\n- Offers stronger protective qualities\n\n### Nephrite\n- More common form of jade\n- Usually lighter green or creamy white\n- Extremely tough and durable\n- Traditionally used for carvings\n\n## Protective Properties\n\nDifferent colors of jade offer various types of protection:\n\n- **Green jade**: Overall protection, health, and harmony\n- **White jade**: Mental clarity and spiritual protection\n- **Lavender jade**: Connection to higher spiritual realms\n- **Black jade**: Protection from negative energy and harm\n- **Yellow jade**: Positive energy and joy\n\n## How to Test for Authentic Jade\n\nAuthentic jade is expensive, and the market is filled with imitations. Here are ways to verify authenticity:\n\n1. **The temperature test**: Real jade remains cool to the touch even after being held\n2. **Light test**: Hold it up to light - genuine jade has a granular structure\n3. **Sound test**: When tapped against another piece of jade, it produces a bell-like sound\n4. **Price**: If it seems too cheap, it\'s likely not authentic jade\n\n## Best Jade Pieces for Protection\n\n### Buddha Pendants\nCarved jade Buddhas offer spiritual protection and guidance.\n\n### Pi Disc (Bi)\nThe circular shape with a hole represents heaven and provides overall protection.\n\n### Dragon Carvings\nCombines the protective power of jade with the strength of the dragon.\n\n### Bangles\nWorn on the left wrist for maximum protective benefits.\n\n## Caring for Your Jade\n\nTo maintain the protective energy of your jade:\n\n1. Clean regularly with a soft cloth\n2. Periodically soak in salt water to cleanse energetically\n3. Allow it to bathe in moonlight during the full moon\n4. Avoid harsh chemicals or ultrasonic cleaners\n5. Store separately from other jewelry to prevent scratches\n\nBy selecting authentic jade and understanding its properties, you can harness the ancient protective powers of this remarkable stone.',
    category: 'Gemstones',
    tags: ['jade', 'protection', 'authenticity'],
    author: 'Napat Wongsa',
    publishedDate: new Date('2023-04-05'),
    status: 'draft',
    featuredImage: 'https://example.com/images/jade-selection.jpg'
  },
];

type ArticleStatus = 'published' | 'draft';

const statusColors: Record<ArticleStatus, string> = {
  published: 'bg-green-100 text-green-800 border-green-200',
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const Articles = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState(mockArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<(typeof articles)[0] | null>(null);
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  
  // Unique categories from articles
  const uniqueCategories = Array.from(new Set(articles.map(article => article.category)));

  // Filter articles
  const filteredArticles = articles.filter(article => 
    (categoryFilter === 'all' || article.category === categoryFilter) &&
    (statusFilter === 'all' || article.status === statusFilter) &&
    (
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  // Handle article edit dialog
  const openArticleDialog = (article: (typeof articles)[0] | null, mode: 'view' | 'edit' | 'create') => {
    setSelectedArticle(article || {
      id: `A${String(articles.length + 1).padStart(3, '0')}`,
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      author: '',
      publishedDate: new Date(),
      status: 'draft',
      featuredImage: ''
    } as typeof articles[0]);
    setDialogMode(mode);
    setShowArticleDialog(true);
  };

  // Handle article creation/edit
  const handleSaveArticle = () => {
    if (!selectedArticle) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (dialogMode === 'create') {
        setArticles(prev => [...prev, selectedArticle]);
        toast({
          title: "Article Created",
          description: "Your article has been created successfully.",
        });
      } else if (dialogMode === 'edit') {
        setArticles(prev => 
          prev.map(article => 
            article.id === selectedArticle.id ? selectedArticle : article
          )
        );
        toast({
          title: "Article Updated",
          description: "Your article has been updated successfully.",
        });
      }
      
      setIsLoading(false);
      setShowArticleDialog(false);
    }, 800);
  };

  // Handle article delete
  const handleDeleteArticle = () => {
    if (!selectedArticle) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setArticles(prev => prev.filter(article => article.id !== selectedArticle.id));
      setIsLoading(false);
      setShowDeleteDialog(false);
      
      toast({
        title: "Article Deleted",
        description: "The article has been deleted successfully.",
      });
    }, 500);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (article: (typeof articles)[0]) => {
    setSelectedArticle(article);
    setShowDeleteDialog(true);
  };

  // Handle article field change
  const handleArticleChange = (field: string, value: any) => {
    if (!selectedArticle) return;
    setSelectedArticle({...selectedArticle, [field]: value});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Button 
          onClick={() => openArticleDialog(null, 'create')} 
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Create Article
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {articles.filter(a => a.status === 'published').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {articles.filter(a => a.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 relative">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(3).fill(null).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))
        ) : (
          filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <div className="h-48 bg-muted relative">
                  {/* Placeholder for article image */}
                  <div className="flex items-center justify-center h-full bg-slate-200">
                    <BookText size={48} className="text-slate-400" />
                  </div>
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      statusColors[article.status as ArticleStatus]
                    }`}
                  >
                    {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    By {article.author} • {format(article.publishedDate, 'dd MMM yyyy')}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge variant="secondary">{article.category}</Badge>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openArticleDialog(article, 'view')}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openArticleDialog(article, 'edit')}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openDeleteDialog(article)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="md:col-span-3 p-8 text-center">
              <BookText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )
        )}
      </div>

      {/* Article Dialog (Create/Edit/View) */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        {selectedArticle && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === 'create' ? 'Create Article' : 
                  dialogMode === 'edit' ? 'Edit Article' : 'View Article'}
              </DialogTitle>
              {dialogMode === 'view' && (
                <DialogDescription>
                  ID: {selectedArticle.id} • Created: {format(selectedArticle.publishedDate, 'dd MMMM yyyy')}
                </DialogDescription>
              )}
            </DialogHeader>
            
            <Tabs defaultValue={dialogMode === 'view' ? "preview" : "edit"}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="edit" disabled={dialogMode === 'view'}>Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title"
                      value={selectedArticle.title} 
                      onChange={(e) => handleArticleChange('title', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea 
                      id="excerpt"
                      value={selectedArticle.excerpt} 
                      onChange={(e) => handleArticleChange('excerpt', e.target.value)}
                      disabled={isLoading}
                      className="h-20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input 
                        id="category"
                        value={selectedArticle.category} 
                        onChange={(e) => handleArticleChange('category', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={selectedArticle.status} 
                        onValueChange={(value) => handleArticleChange('status', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input 
                        id="author"
                        value={selectedArticle.author} 
                        onChange={(e) => handleArticleChange('author', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input 
                        id="tags"
                        value={selectedArticle.tags.join(', ')} 
                        onChange={(e) => handleArticleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea 
                      id="content"
                      value={selectedArticle.content} 
                      onChange={(e) => handleArticleChange('content', e.target.value)}
                      disabled={isLoading}
                      className="min-h-[300px] font-mono"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="bg-white rounded-md p-4 border">
                <div className="prose max-w-none dark:prose-invert">
                  <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>By {selectedArticle.author}</span>
                    <span>•</span>
                    <span>{format(selectedArticle.publishedDate, 'MMMM dd, yyyy')}</span>
                    <span>•</span>
                    <Badge className={statusColors[selectedArticle.status as ArticleStatus]}>
                      {selectedArticle.status.charAt(0).toUpperCase() + selectedArticle.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <p className="font-medium text-lg mb-6">{selectedArticle.excerpt}</p>
                  
                  {/* Very simple markdown preview - in a real app, use a proper markdown renderer */}
                  <div className="whitespace-pre-line">
                    {selectedArticle.content.split('# ').map((section, index) => {
                      if (index === 0) return <p key={index}>{section}</p>;
                      const [title, ...content] = section.split('\n');
                      return (
                        <div key={index}>
                          <h2 className="text-xl font-bold mt-6 mb-2">{title}</h2>
                          <p>{content.join('\n')}</p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="font-semibold">Tags:</span>
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              {dialogMode === 'view' ? (
                <Button 
                  onClick={() => setShowArticleDialog(false)}
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowArticleDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveArticle}
                    disabled={isLoading || !selectedArticle.title}
                  >
                    {isLoading ? 'Saving...' : 'Save Article'}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        {selectedArticle && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the article "{selectedArticle.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteArticle}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Article'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Articles;

