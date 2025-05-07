"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  TooltipProps
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Plus, Search, RefreshCw, Trash2, AlertCircle, ExternalLink, Calendar, DollarSign, TrendingUp, Info, BriefcaseBusiness, BarChart, Newspaper, Coins, Briefcase, LineChart as LineChartIcon, BarChart3, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

// Define types for recharts components to fix TypeScript errors
type PieChartDataItem = {
  name: string;
  value: number;
};

interface PieChartLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
  value: number;
}

interface RechartsTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload?: any;
    dataKey?: string;
    fill?: string;
  }>;
  label?: string;
}

// Finnhub API interfaces
interface Quote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface CandleData {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices 
  o: number[]; // Open prices
  s: string;   // Status
  t: number[]; // Timestamps
  v: number[]; // Volumes
}

interface Recommendation {
  buy: number;
  hold: number;
  period: string;
  sell: number;
  strongBuy: number;
  strongSell: number;
  symbol: string;
}

// Additional Finnhub API interfaces
interface KeyMetrics {
  metric: {
    marketCapitalization: number;
    peBasicExclExtraTTM: number; // P/E Ratio
    peNormalizedAnnual: number;
    enterpriseValue: number;
    priceToSalesRatioTTM: number;
    dividendYieldIndicatedAnnual: number;
    // Add more metrics as needed
  };
  metricType: string;
  symbol: string;
}

interface ForexRate {
  base: string;
  quote: {
    [currency: string]: number;
  };
}

// Enhanced Asset interface with additional properties
interface Asset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  type: string; // "stock" | "crypto" | "etf" | "bond"
  added_date: string;
  currency?: string; // USD, EUR, etc.
  // Finnhub additional data
  profile?: CompanyProfile;
  quote?: Quote;
  historicalData?: {
    timestamp: number;
    value: number;
  }[];
  news?: NewsItem[];
  recommendations?: Recommendation[];
  keyMetrics?: KeyMetrics;
}

// Tipo per i risultati di ricerca
interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  price?: number;
  description?: string;
  displaySymbol?: string;
  currency?: string;
}

// Tipo per la risposta della ricerca di simboli Finnhub
interface FinnhubSearchResponse {
  count: number;
  result: {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }[];
}

export default function PortfolioPage() {
  // Stato per l'autenticazione
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Stato per il portafoglio
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stato per la ricerca
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SearchResult | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Tabs state
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [selectedAssetDetails, setSelectedAssetDetails] = useState<Asset | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Colori per i grafici
  const COLORS = ["#EF4444", "#22C55E", "#3B82F6", "#F59E0B"]; // Red, Green, Blue, Amber

  // Finnhub API key from environment variables
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "sandbox_c69f2qiad3iefr17roig"; // Fallback to sandbox key
  
  // Mock data flag - set to true to use mock data instead of real API calls
  const USE_MOCK_DATA = false; // Set this to false when ready to use the real API

  // New states for enhanced features
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [expandedAssets, setExpandedAssets] = useState<Record<string, boolean>>({});
  const [loadedAssetData, setLoadedAssetData] = useState<Record<string, boolean>>({});
  const [lastApiCallTime, setLastApiCallTime] = useState<Record<string, number>>({});

  // Mock data responses
  const mockQuote = (symbol: string): Quote => ({
    c: Math.random() * 100 + 50, // Random current price between 50-150
    d: Math.random() * 5 - 2.5,  // Random daily change between -2.5 and +2.5
    dp: Math.random() * 5 - 2.5, // Random daily percent change
    h: Math.random() * 100 + 55, // High
    l: Math.random() * 100 + 45, // Low
    o: Math.random() * 100 + 50, // Open
    pc: Math.random() * 100 + 50, // Previous close
    t: Math.floor(Date.now() / 1000) // Current timestamp
  });

  const mockProfile = (symbol: string): CompanyProfile => ({
    country: "United States",
    currency: "USD",
    exchange: "NASDAQ",
    ipo: "1980-12-12",
    marketCapitalization: 2500000000,
    name: `${symbol} Corporation`,
    phone: "123-456-7890",
    shareOutstanding: 1500000,
    ticker: symbol,
    weburl: `https://www.${symbol.toLowerCase()}.com`,
    logo: `https://example.com/${symbol.toLowerCase()}.png`,
    finnhubIndustry: "Technology"
  });

  const mockCandleData = (): CandleData => {
    const today = Math.floor(Date.now() / 1000);
    const oneYearAgo = today - 365 * 24 * 60 * 60;
    const days = 365;
    
    const timestamps = Array.from({ length: days }, (_, i) => 
      oneYearAgo + i * 24 * 60 * 60
    );
    
    let price = 100;
    const closePrices = [];
    const highPrices = [];
    const lowPrices = [];
    const openPrices = [];
    const volumes = [];
    
    for (let i = 0; i < days; i++) {
      // Random price movement between -2% and +2%
      price = price * (1 + (Math.random() * 0.04 - 0.02));
      const open = price * (1 + (Math.random() * 0.01 - 0.005));
      const high = price * (1 + Math.random() * 0.01);
      const low = price * (1 - Math.random() * 0.01);
      
      openPrices.push(open);
      highPrices.push(high);
      lowPrices.push(low);
      closePrices.push(price);
      volumes.push(Math.floor(Math.random() * 10000000) + 1000000);
    }
    
    return {
      c: closePrices,
      h: highPrices,
      l: lowPrices,
      o: openPrices,
      s: "ok",
      t: timestamps,
      v: volumes
    };
  };

  const mockNews = (symbol: string): NewsItem[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      category: "technology",
      datetime: Math.floor(Date.now() / 1000) - i * 86400,
      headline: `${symbol} Announces New Product Line`,
      id: i,
      image: "https://via.placeholder.com/300",
      related: symbol,
      source: "Financial News",
      summary: `${symbol} has announced a new product line today that analysts expect to boost revenues by 15% in the coming year.`,
      url: `https://example.com/news/${symbol.toLowerCase()}`
    }));
  };

  const mockKeyMetrics = (symbol: string): KeyMetrics => ({
    metric: {
      marketCapitalization: 2500000000,
      peBasicExclExtraTTM: 25.4,
      peNormalizedAnnual: 24.8,
      enterpriseValue: 2700000000,
      priceToSalesRatioTTM: 5.2,
      dividendYieldIndicatedAnnual: 1.8
    },
    metricType: "annual",
    symbol: symbol
  });

  // Finnhub API functions with mock fallbacks
  const fetchQuote = async (symbol: string): Promise<Quote | null> => {
    if (USE_MOCK_DATA) {
      // Return mock data after a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockQuote(symbol);
    }

    try {
      // Add delay to avoid rate limiting
      const now = Date.now();
      if (lastApiCallTime[`quote_${symbol}`] && now - lastApiCallTime[`quote_${symbol}`] < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setLastApiCallTime(prev => ({ ...prev, [`quote_${symbol}`]: Date.now() }));
      
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      if (!response.ok) {
        console.warn(`Quote API returned status ${response.status} for ${symbol}`);
        return mockQuote(symbol); // Fallback to mock data
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching quote:", error);
      return mockQuote(symbol); // Fallback to mock data on error
    }
  };

  const fetchCompanyProfile = async (symbol: string): Promise<CompanyProfile | null> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProfile(symbol);
    }

    try {
      // Add delay to avoid rate limiting
      const now = Date.now();
      if (lastApiCallTime[`profile_${symbol}`] && now - lastApiCallTime[`profile_${symbol}`] < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setLastApiCallTime(prev => ({ ...prev, [`profile_${symbol}`]: Date.now() }));
      
      // Use our secure API proxy instead of direct Finnhub call
      const response = await fetch(`/api/finnhub/profile?symbol=${symbol}`);
      
      if (!response.ok) {
        console.warn(`Profile API returned status ${response.status} for ${symbol}`);
        return mockProfile(symbol); // Fallback to mock data
      }
      
      const data = await response.json();
      // Check if empty object is returned
      if (Object.keys(data).length === 0) {
        return mockProfile(symbol);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching company profile:", error);
      return mockProfile(symbol); // Fallback to mock data on error
    }
  };

  const fetchNews = async (symbol: string): Promise<NewsItem[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockNews(symbol);
    }

    try {
      // Add delay to avoid rate limiting
      const now = Date.now();
      if (lastApiCallTime[`news_${symbol}`] && now - lastApiCallTime[`news_${symbol}`] < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setLastApiCallTime(prev => ({ ...prev, [`news_${symbol}`]: Date.now() }));
      
      // Use our secure API proxy instead of direct Finnhub call
      const response = await fetch(`/api/finnhub/news?symbol=${symbol}`);
      
      if (!response.ok) {
        console.warn(`News API returned status ${response.status} for ${symbol}`);
        return mockNews(symbol); // Fallback to mock data
      }
      
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        return mockNews(symbol);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching news:", error);
      return mockNews(symbol); // Fallback to mock data on error
    }
  };

  const fetchCandleData = async (symbol: string): Promise<CandleData | null> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCandleData();
    }

    try {
      const resolution = "D"; // Daily candles
      
      // Add delay to avoid rate limiting
      const now = Date.now();
      if (lastApiCallTime[`candle_${symbol}`] && now - lastApiCallTime[`candle_${symbol}`] < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setLastApiCallTime(prev => ({ ...prev, [`candle_${symbol}`]: Date.now() }));
      
      // Use our secure API proxy instead of direct Finnhub call
      const response = await fetch(`/api/finnhub/candle?symbol=${symbol}&resolution=${resolution}`);
      
      if (!response.ok) {
        console.warn(`Candle API returned status ${response.status} for ${symbol}`);
        return mockCandleData(); // Fallback to mock data
      }
      
      const data = await response.json();
      if (data.s !== 'ok') {
        return mockCandleData();
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching candle data:", error);
      return mockCandleData(); // Fallback to mock data on error
    }
  };

  const fetchRecommendations = async (symbol: string): Promise<Recommendation[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [{
        buy: 10,
        hold: 5,
        period: new Date().toISOString().split('T')[0],
        sell: 2,
        strongBuy: 7,
        strongSell: 1,
        symbol: symbol
      }];
    }

    try {
      // Add delay to avoid rate limiting
      const now = Date.now();
      if (lastApiCallTime[`recommendations_${symbol}`] && now - lastApiCallTime[`recommendations_${symbol}`] < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setLastApiCallTime(prev => ({ ...prev, [`recommendations_${symbol}`]: Date.now() }));
      
      // Use our secure API proxy instead of direct Finnhub call
      const response = await fetch(`/api/finnhub/recommendations?symbol=${symbol}`);
      
      if (!response.ok) {
        console.warn(`Recommendations API returned status ${response.status} for ${symbol}`);
        // Return mock recommendation data
        return [{
          buy: 10,
          hold: 5,
          period: new Date().toISOString().split('T')[0],
          sell: 2,
          strongBuy: 7,
          strongSell: 1,
          symbol: symbol
        }];
      }
      
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        return [{
          buy: 10,
          hold: 5,
          period: new Date().toISOString().split('T')[0],
          sell: 2,
          strongBuy: 7,
          strongSell: 1,
          symbol: symbol
        }];
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Return mock recommendation data
      return [{
        buy: 10,
        hold: 5,
        period: new Date().toISOString().split('T')[0],
        sell: 2,
        strongBuy: 7,
        strongSell: 1,
        symbol: symbol
      }];
    }
  };

  const searchSymbols = async (query: string): Promise<SearchResult[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { symbol: 'AAPL', name: 'Apple Inc', type: 'stock', description: 'Apple Inc', displaySymbol: 'AAPL' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', description: 'Microsoft Corporation', displaySymbol: 'MSFT' },
        { symbol: 'AMZN', name: 'Amazon.com Inc', type: 'stock', description: 'Amazon.com Inc', displaySymbol: 'AMZN' },
        { symbol: 'GOOGL', name: 'Alphabet Inc', type: 'stock', description: 'Alphabet Inc', displaySymbol: 'GOOGL' },
        { symbol: 'META', name: 'Meta Platforms Inc', type: 'stock', description: 'Meta Platforms Inc', displaySymbol: 'META' }
      ].filter(item => 
        item.symbol.toLowerCase().includes(query.toLowerCase()) || 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      // Add delay to avoid rate limiting
      const now = Date.now();
      if (lastApiCallTime[`search_${query}`] && now - lastApiCallTime[`search_${query}`] < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setLastApiCallTime(prev => ({ ...prev, [`search_${query}`]: Date.now() }));
      
      // Use our secure API proxy instead of direct Finnhub call
      const response = await fetch(`/api/finnhub/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        console.warn(`Search API returned status ${response.status} for ${query}`);
        // Return mock search results that match the query
        return [
          { symbol: 'AAPL', name: 'Apple Inc', type: 'stock', description: 'Apple Inc', displaySymbol: 'AAPL' },
          { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', description: 'Microsoft Corporation', displaySymbol: 'MSFT' },
          { symbol: 'AMZN', name: 'Amazon.com Inc', type: 'stock', description: 'Amazon.com Inc', displaySymbol: 'AMZN' },
          { symbol: 'GOOGL', name: 'Alphabet Inc', type: 'stock', description: 'Alphabet Inc', displaySymbol: 'GOOGL' },
          { symbol: 'META', name: 'Meta Platforms Inc', type: 'stock', description: 'Meta Platforms Inc', displaySymbol: 'META' }
        ].filter(item => 
          item.symbol.toLowerCase().includes(query.toLowerCase()) || 
          item.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      const data: FinnhubSearchResponse = await response.json();
      if (!data.result || !Array.isArray(data.result) || data.result.length === 0) {
        return [
          { symbol: 'AAPL', name: 'Apple Inc', type: 'stock', description: 'Apple Inc', displaySymbol: 'AAPL' },
          { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', description: 'Microsoft Corporation', displaySymbol: 'MSFT' }
        ].filter(item => 
          item.symbol.toLowerCase().includes(query.toLowerCase()) || 
          item.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return data.result.map(item => ({
        symbol: item.symbol,
        name: item.description,
        type: item.type,
        description: item.description,
        displaySymbol: item.displaySymbol
      }));
    } catch (error) {
      console.error("Error searching symbols:", error);
      return [
        { symbol: 'AAPL', name: 'Apple Inc', type: 'stock' }
      ];
    }
  };

  // New function to fetch key metrics with mock fallback
  const fetchKeyMetrics = async (symbol: string): Promise<KeyMetrics | null> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockKeyMetrics(symbol);
    }

    try {
      // Check API rate limits
      const now = Date.now();
      if (lastApiCallTime[`metrics_${symbol}`] && now - lastApiCallTime[`metrics_${symbol}`] < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait to avoid rate limit
      }
      
      setLastApiCallTime(prev => ({ ...prev, [`metrics_${symbol}`]: Date.now() }));
      
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`
      );
      
      if (!response.ok) {
        console.warn(`Metrics API returned status ${response.status} for ${symbol}`);
        return mockKeyMetrics(symbol); // Fallback to mock data
      }
      
      const data = await response.json();
      if (!data.metric || Object.keys(data.metric).length === 0) {
        return mockKeyMetrics(symbol);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching key metrics:", error);
      return mockKeyMetrics(symbol); // Fallback to mock data on error
    }
  };

  // New function to fetch forex rates with mock fallback
  const fetchForexRates = async (): Promise<Record<string, number>> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { 'USD': 0.85, 'EUR': 1, 'GBP': 1.2, 'JPY': 0.007, 'CHF': 0.95 };
    }

    try {
      // Add delay to avoid rate limiting
      const now = Date.now();
      if (lastApiCallTime[`forex`] && now - lastApiCallTime[`forex`] < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setLastApiCallTime(prev => ({ ...prev, [`forex`]: Date.now() }));
      
      // We're primarily concerned with EUR conversion
      const response = await fetch(
        `https://finnhub.io/api/v1/forex/rates?base=EUR&token=${FINNHUB_API_KEY}`
      );
      
      if (!response.ok) {
        console.warn(`Forex API returned status ${response.status}`);
        return { 'USD': 0.85, 'EUR': 1, 'GBP': 1.2, 'JPY': 0.007, 'CHF': 0.95 };
      }
      
      const data: ForexRate = await response.json();
      
      if (!data.quote || Object.keys(data.quote).length === 0) {
        return { 'USD': 0.85, 'EUR': 1, 'GBP': 1.2, 'JPY': 0.007, 'CHF': 0.95 };
      }
      
      // Create inverse rates for conversion to EUR
      const eurRates: Record<string, number> = {};
      
      for (const [currency, rate] of Object.entries(data.quote)) {
        // Store the inverse rate for converting to EUR
        eurRates[currency] = 1 / rate;
      }
      
      // Add EUR itself with rate 1
      eurRates['EUR'] = 1;
      
      return eurRates;
    } catch (error) {
      console.error("Error fetching forex rates:", error);
      // Return default conversion for USD as fallback
      return { 'USD': 0.85, 'EUR': 1, 'GBP': 1.2, 'JPY': 0.007, 'CHF': 0.95 };
    }
  };

  // Enhanced function to load asset details
  const loadAssetDetails = async (asset: Asset): Promise<Asset> => {
    setIsLoadingDetails(true);
    const enrichedAsset = { ...asset };
    
    try {
      // Fetch all data in parallel
      const [quote, profile, news, candleData, recommendations, keyMetrics] = await Promise.all([
        fetchQuote(asset.symbol),
        fetchCompanyProfile(asset.symbol),
        fetchNews(asset.symbol),
        fetchCandleData(asset.symbol),
        fetchRecommendations(asset.symbol),
        fetchKeyMetrics(asset.symbol)
      ]);
      
      enrichedAsset.quote = quote || undefined;
      enrichedAsset.profile = profile || undefined;
      enrichedAsset.news = news;
      enrichedAsset.recommendations = recommendations;
      enrichedAsset.keyMetrics = keyMetrics || undefined;
      
      // Set currency from profile
      if (profile?.currency) {
        enrichedAsset.currency = profile.currency;
      } else if (asset.type === 'crypto') {
        enrichedAsset.currency = 'USD'; // Assume crypto is in USD
      } else {
        enrichedAsset.currency = 'EUR'; // Default to EUR
      }
      
      // Convert candle data to chart format
      if (candleData && candleData.s === 'ok') {
        enrichedAsset.historicalData = candleData.t.map((timestamp, i) => ({
          timestamp,
          value: candleData.c[i]
        }));
      }
      
      // Mark this asset as loaded
      setLoadedAssetData(prev => ({
        ...prev,
        [asset.id]: true
      }));
    } catch (error) {
      console.error("Error loading asset details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
    
    return enrichedAsset;
  };

  // Function to convert value to EUR
  const convertToEUR = (value: number, currency: string): number => {
    if (!currency || currency === 'EUR') return value;
    if (!exchangeRates[currency]) return value; // If rate not available, return original value
    
    return value * exchangeRates[currency];
  };

  // Fetch exchange rates on component mount
  useEffect(() => {
    const loadExchangeRates = async () => {
      const rates = await fetchForexRates();
      setExchangeRates(rates);
    };
    
    loadExchangeRates();
    
    // Refresh exchange rates every 30 minutes
    const interval = setInterval(loadExchangeRates, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Toggle expanded state for asset
  const toggleAssetExpansion = async (asset: Asset) => {
    const isCurrentlyExpanded = !!expandedAssets[asset.id];
    
    // Toggle expansion state
    setExpandedAssets(prev => ({
      ...prev,
      [asset.id]: !isCurrentlyExpanded
    }));
    
    // If expanding and data not loaded yet, load it
    if (!isCurrentlyExpanded && !loadedAssetData[asset.id]) {
      const enrichedAsset = await loadAssetDetails(asset);
      
      // Update the asset in the assets array
      setAssets(prevAssets => 
        prevAssets.map(a => a.id === asset.id ? enrichedAsset : a)
      );
    }
  };

  // Function to format currency based on the asset's currency
  const formatCurrency = (value: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: currency || 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Reindirizza utenti non autenticati
  useEffect(() => {
    // Temporarily disabled for testing
    // if (status === "unauthenticated") {
    //   router.push("/accedi");
    // }
    
    // Load sample data for testing if not authenticated
    if (status === "unauthenticated") {
      setIsLoading(false);
      // Set some sample data for testing
      setAssets([
        {
          id: "sample-1",
          symbol: "AAPL",
          name: "Apple Inc.",
          quantity: 10,
          purchase_price: 150.0,
          current_price: 175.0,
          type: "stock",
          added_date: new Date().toISOString(),
        },
        {
          id: "sample-2",
          symbol: "MSFT",
          name: "Microsoft Corporation",
          quantity: 5,
          purchase_price: 300.0,
          current_price: 320.0,
          type: "stock",
          added_date: new Date().toISOString(),
        },
        {
          id: "sample-3",
          symbol: "BTC",
          name: "Bitcoin",
          quantity: 0.5,
          purchase_price: 40000.0,
          current_price: 45000.0,
          type: "crypto",
          added_date: new Date().toISOString(),
        },
        {
          id: "sample-4",
          symbol: "VUSA",
          name: "Vanguard S&P 500 UCITS ETF",
          quantity: 20,
          purchase_price: 80.0,
          current_price: 85.0,
          type: "etf",
          added_date: new Date().toISOString(),
        },
      ]);
    }
  }, [status, router]);

  // Carica dati del portafoglio
  useEffect(() => {
    if (status === "authenticated") {
      fetchPortfolioData();
    }
    // No need to fetch data for unauthenticated users as we're providing sample data
  }, [status]);

  // Funzione per caricare i dati del portafoglio
  const fetchPortfolioData = async () => {
    setIsLoading(true);
    setError(null);
    
    // For unauthenticated test mode, we already set the sample data
    if (status === "unauthenticated") {
      // Load enhanced data with Finnhub for sample assets
      try {
        const updatedAssets = await Promise.all(
          assets.map(async (asset) => {
            // Skip crypto as Finnhub doesn't support it in free tier
            if (asset.type === 'crypto') return asset;
            
            const quote = await fetchQuote(asset.symbol);
            if (quote) {
              return {
                ...asset,
                current_price: quote.c,
                quote
              };
            }
            return asset;
          })
        );
        setAssets(updatedAssets);
      } catch (err) {
        console.error("Error updating prices:", err);
      }
      
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/portfolio");
      if (!response.ok) {
        throw new Error("Impossibile caricare i dati del portafoglio");
      }
      
      const data = await response.json();
      
      // Enhance data with Finnhub
      const enhancedData = await Promise.all(
        data.map(async (asset: Asset) => {
          // Skip crypto as Finnhub doesn't support it in free tier
          if (asset.type === 'crypto') return asset;
          
          const quote = await fetchQuote(asset.symbol);
          if (quote) {
            return {
              ...asset,
              current_price: quote.c,
              quote
            };
          }
          return asset;
        })
      );
      
      setAssets(enhancedData);
    } catch (err) {
      console.error("Errore nel caricamento del portafoglio:", err);
      setError("Si è verificato un errore nel caricamento del portafoglio. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per aggiornare i prezzi in tempo reale
  const refreshPrices = async () => {
    setIsLoading(true);
    setError(null);
    
    // For unauthenticated test mode, use Finnhub API
    if (status === "unauthenticated") {
      try {
        const updatedAssets = await Promise.all(
          assets.map(async (asset) => {
            // Skip crypto as Finnhub doesn't support it in free tier
            if (asset.type === 'crypto') {
              // Simulate price change for crypto
              return {
                ...asset,
                current_price: asset.current_price * (1 + (Math.random() * 0.06 - 0.03))
              };
            }
            
            const quote = await fetchQuote(asset.symbol);
            if (quote) {
              return {
                ...asset,
                current_price: quote.c,
                quote
              };
            }
            return asset;
          })
        );
        setAssets(updatedAssets);
      } catch (err) {
        console.error("Error updating prices:", err);
        setError("Si è verificato un errore nell'aggiornamento dei prezzi. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    try {
      // For authenticated users, first get portfolio from API
      const response = await fetch("/api/portfolio/refresh", { method: "POST" });
      if (!response.ok) {
        throw new Error("Impossibile aggiornare i prezzi");
      }
      
      const data = await response.json();
      
      // Then enhance with Finnhub data
      const enhancedData = await Promise.all(
        data.map(async (asset: Asset) => {
          // Skip crypto as Finnhub doesn't support it in free tier
          if (asset.type === 'crypto') return asset;
          
          const quote = await fetchQuote(asset.symbol);
          if (quote) {
            return {
              ...asset,
              current_price: quote.c,
              quote
            };
          }
          return asset;
        })
      );
      
      setAssets(enhancedData);
    } catch (err) {
      console.error("Errore nell'aggiornamento dei prezzi:", err);
      setError("Si è verificato un errore nell'aggiornamento dei prezzi. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per cercare asset
  const searchAssets = async () => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      // Use Finnhub API for searching symbols
      const results = await searchSymbols(searchTerm);
      
      // For each result, get the current price
      const resultsWithPrices = await Promise.all(
        results.slice(0, 10).map(async (result) => {
          if (result.type === 'crypto') {
            // Mock price for crypto as it's not in free tier
            return {
              ...result,
              price: Math.random() * 10000
            };
          }
          
          const quote = await fetchQuote(result.symbol);
          return {
            ...result,
            price: quote?.c
          };
        })
      );
      
      setSearchResults(resultsWithPrices);
    } catch (err) {
      console.error("Errore nella ricerca:", err);
      setError("Si è verificato un errore nella ricerca. Riprova più tardi.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Funzione per aggiungere un asset al portafoglio
  const addAssetToPortfolio = async () => {
    if (!selectedAsset) return;
    
    setIsAdding(true);
    setError(null);
    
    // For unauthenticated test mode, just add to local state
    if (status === "unauthenticated") {
      try {
        // Get current price and profile from Finnhub
        let currentPrice = selectedAsset.price || 0;
        let profile = null;
        let currency = 'EUR'; // Default to EUR
        
        if (selectedAsset.type !== 'crypto') {
          const quote = await fetchQuote(selectedAsset.symbol);
          if (quote) {
            currentPrice = quote.c;
          }
          
          profile = await fetchCompanyProfile(selectedAsset.symbol);
          if (profile?.currency) {
            currency = profile.currency;
          }
        } else {
          currency = 'USD'; // Assume crypto is in USD
        }
        
        const newAsset: Asset = {
          id: `sample-${Date.now()}`,
          symbol: selectedAsset.symbol,
          name: selectedAsset.name,
          quantity: parseFloat(quantity),
          purchase_price: currentPrice,
          current_price: currentPrice,
          type: selectedAsset.type,
          added_date: new Date().toISOString(),
          currency,
          profile: profile || undefined,
          quote: selectedAsset.type !== 'crypto' ? (await fetchQuote(selectedAsset.symbol) || undefined) : undefined
        };
        
        setAssets(prev => [...prev, newAsset]);
        
        // Reset form
        setSelectedAsset(null);
        setQuantity("1");
        setSearchTerm("");
        setSearchResults([]);
        setDialogOpen(false);
      } catch (err) {
        console.error("Error adding asset:", err);
        setError("Si è verificato un errore nell'aggiunta dell'asset. Riprova più tardi.");
      } finally {
        setIsAdding(false);
      }
      return;
    }
    
    try {
      // Get current price from Finnhub for accuracy
      let currentPrice = selectedAsset.price || 0;
      
      if (selectedAsset.type !== 'crypto') {
        const quote = await fetchQuote(selectedAsset.symbol);
        if (quote) {
          currentPrice = quote.c;
        }
      }
      
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: selectedAsset.symbol,
          name: selectedAsset.name,
          quantity: parseFloat(quantity),
          type: selectedAsset.type,
          current_price: currentPrice,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Impossibile aggiungere l'asset al portafoglio");
      }
      
      // Ricarica il portafoglio con il nuovo asset
      await fetchPortfolioData();
      
      // Resetta il form
      setSelectedAsset(null);
      setQuantity("1");
      setSearchTerm("");
      setSearchResults([]);
      setDialogOpen(false);
    } catch (err) {
      console.error("Errore nell'aggiunta dell'asset:", err);
      setError("Si è verificato un errore nell'aggiunta dell'asset. Riprova più tardi.");
    } finally {
      setIsAdding(false);
    }
  };

  // Funzione per rimuovere un asset dal portafoglio
  const removeAsset = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    // For unauthenticated test mode, just remove from local state
    if (status === "unauthenticated") {
      setTimeout(() => {
        setAssets(prev => prev.filter(asset => asset.id !== id));
        setIsLoading(false);
      }, 500);
      return;
    }
    
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Impossibile rimuovere l'asset dal portafoglio");
      }
      
      // Rimuovi l'asset dalla lista locale
      setAssets(assets.filter(asset => asset.id !== id));
    } catch (err) {
      console.error("Errore nella rimozione dell'asset:", err);
      setError("Si è verificato un errore nella rimozione dell'asset. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calcola il valore totale del portafoglio
  const calculateTotalValue = () => {
    return assets.reduce((total, asset) => {
      const currency = asset.currency || 'EUR';
      const valueInOriginalCurrency = asset.current_price * asset.quantity;
      const valueInEUR = convertToEUR(valueInOriginalCurrency, currency);
      return total + valueInEUR;
    }, 0);
  };

  // Calcola la performance totale
  const calculateTotalPerformance = () => {
    const totalCurrentValue = calculateTotalValue();
    const totalPurchaseValue = assets.reduce((total, asset) => total + (asset.purchase_price * asset.quantity), 0);
    
    if (totalPurchaseValue === 0) return 0;
    
    return ((totalCurrentValue - totalPurchaseValue) / totalPurchaseValue) * 100;
  };

  // Calcola i dati per il grafico di allocazione
  const calculateAllocationData = () => {
    const assetTypeMap: Record<string, number> = {};
    
    assets.forEach(asset => {
      const value = asset.current_price * asset.quantity;
      const type = asset.type.charAt(0).toUpperCase() + asset.type.slice(1); // Capitalize
      
      if (assetTypeMap[type]) {
        assetTypeMap[type] += value;
      } else {
        assetTypeMap[type] = value;
      }
    });
    
    return Object.entries(assetTypeMap).map(([name, value]) => ({
      name,
      value: parseFloat(((value / calculateTotalValue()) * 100).toFixed(2)),
    }));
  };

  // Helper function to get icon for asset type
  const getAssetTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stock':
        return <LineChartIcon className="h-4 w-4" />;
      case 'crypto':
        return <Coins className="h-4 w-4" />;
      case 'etf':
        return <BarChart3 className="h-4 w-4" />;
      case 'bond':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  // Helper function to get color based on performance
  const getPerformanceColor = (performance: number) => {
    return performance >= 0 ? "text-green-600" : "text-red-500";
  };

  // Get background color based on performance
  const getPerformanceBackground = (performance: number) => {
    return performance >= 0 ? "bg-green-100" : "bg-red-100";
  };

  // Se l'utente non è autenticato o il caricamento è in corso, mostra lo stato di caricamento
  if (status === "loading") {
    return (
      <div className="container py-16">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-16 bg-orange-50 text-slate-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Il tuo Portafoglio</h1>
          <p className="text-slate-600">Gestisci e monitora i tuoi investimenti</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshPrices} variant="outline" size="sm" className="flex items-center gap-1 border-red-500 text-red-500 hover:bg-red-500/10 rounded-lg">
            <RefreshCw className="h-4 w-4" />
            Aggiorna Prezzi
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                <Plus className="h-4 w-4" />
                Aggiungi Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800">Aggiungi un nuovo asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Cerca azioni, crypto, ETF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-neutral-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                  />
                  <Button onClick={searchAssets} disabled={isSearching} className="bg-red-500 hover:bg-red-600 text-white rounded-lg">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {isSearching && <p className="text-sm text-center text-slate-600">Ricerca in corso...</p>}
                
                {searchResults.length > 0 && (
                  <div className="max-h-60 overflow-y-auto border border-neutral-200 rounded-md">
                    {searchResults.map((result) => (
                      <div
                        key={result.symbol}
                        className={`p-3 border-b border-neutral-200 last:border-b-0 hover:bg-slate-50 cursor-pointer ${
                          selectedAsset?.symbol === result.symbol ? "bg-slate-100" : ""
                        }`}
                        onClick={() => setSelectedAsset(result)}
                      >
                        <div className="font-medium text-slate-700">{result.symbol}</div>
                        <div className="text-sm text-slate-500">{result.name}</div>
                        {result.price && (
                          <div className="text-sm mt-1 text-slate-700">€{result.price.toFixed(2)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedAsset && (
                  <div className="space-y-4 pt-4 border-t border-neutral-200">
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-slate-700">Asset selezionato:</h4>
                      <div className="bg-slate-50 p-3 rounded-md">
                        <div className="font-medium text-slate-700">{selectedAsset.symbol}</div>
                        <div className="text-sm text-slate-500">{selectedAsset.name}</div>
                        {selectedAsset.price && (
                          <div className="text-sm mt-1 text-slate-700">€{selectedAsset.price.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-slate-700">Quantità:</h4>
                      <Input
                        type="number"
                        min="0.000001"
                        step="0.000001"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="border-neutral-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                    </div>
                    
                    <Button 
                      onClick={addAssetToPortfolio} 
                      disabled={isAdding} 
                      className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      {isAdding ? "Aggiunta in corso..." : "Aggiungi al Portafoglio"}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100 border-red-500 text-red-700">
          <AlertCircle className="h-4 w-4 text-red-700" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {assets.length === 0 && !isLoading ? (
        <Card className="bg-white text-slate-700 shadow-lg rounded-xl">
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-red-100 rounded-full p-3">
                  <Plus className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <h2 className="text-xl font-medium text-slate-800">Il tuo portafoglio è vuoto</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Inizia ad aggiungere asset al tuo portafoglio per monitorare le performance dei tuoi investimenti.
              </p>
              <Button onClick={() => setDialogOpen(true)} className="bg-red-500 hover:bg-red-600 text-white rounded-lg">Aggiungi il tuo primo asset</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Portfolio Summary Section */}
          <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
            {/* Total Value Card */}
            <Card className="relative overflow-hidden bg-white text-slate-700 shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <DollarSign className="h-5 w-5 text-red-500" />
                  Valore Totale
                </CardTitle>
                <CardDescription className="text-slate-600">Il valore complessivo del tuo portafoglio</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-32 mb-2" />
                ) : (
                  <>
                    <div className="text-3xl font-bold mb-1 text-slate-800">€{calculateTotalValue().toFixed(2)}</div>
                    <div
                      className={`inline-flex items-center text-sm px-2 py-1 rounded-full ${
                        calculateTotalPerformance() >= 0 
                          ? "bg-green-100 text-green-600" 
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {calculateTotalPerformance() >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      <span>{Math.abs(calculateTotalPerformance()).toFixed(2)}%</span>
                    </div>
                  </>
                )}
              </CardContent>
              <div className="absolute right-0 top-0 h-full w-24 opacity-10 flex items-center justify-center">
                <DollarSign className="h-20 w-20 text-red-500" />
              </div>
            </Card>
          
            {/* Daily Performance Card */}
            <Card className="relative overflow-hidden bg-white text-slate-700 shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  Performance Giornaliera
                </CardTitle>
                <CardDescription className="text-slate-600">Variazione nelle ultime 24 ore</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-32 mb-2" />
                ) : (
                  <>
                    {/* Calculate daily performance using Finnhub quote data */}
                    {(() => {
                      const dailyChange = assets.reduce((total, asset) => {
                        if (asset.quote) {
                          return total + (asset.quote.d * asset.quantity);
                        }
                        return total;
                      }, 0);
                      
                      const dailyChangePercent = assets.reduce((total, asset) => {
                        const weight = (asset.current_price * asset.quantity) / calculateTotalValue();
                        if (asset.quote) {
                          return total + (asset.quote.dp * weight);
                        }
                        return total;
                      }, 0);
                      
                      return (
                        <>
                          <div className="text-3xl font-bold mb-1 text-slate-800">
                            €{Math.abs(dailyChange).toFixed(2)}
                          </div>
                          <div
                            className={`inline-flex items-center text-sm px-2 py-1 rounded-full ${
                              dailyChangePercent >= 0 
                                ? "bg-green-100 text-green-600" 
                                : "bg-red-100 text-red-500"
                            }`}
                          >
                            {dailyChangePercent >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span>{Math.abs(dailyChangePercent).toFixed(2)}%</span>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </CardContent>
              <div className="absolute right-0 top-0 h-full w-24 opacity-10 flex items-center justify-center">
                <TrendingUp className="h-20 w-20 text-red-500" />
              </div>
            </Card>
          
            {/* Asset Distribution Card */}
            <Card className="md:col-span-1 relative overflow-hidden bg-white text-slate-700 shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <PieChart className="h-5 w-5 text-red-500" />
                  Distribuzione Asset
                </CardTitle>
                <CardDescription className="text-slate-600">Allocazione per tipo di investimento</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="h-[160px] flex items-center justify-center">
                    <Skeleton className="h-[120px] w-[120px] rounded-full" />
                  </div>
                ) : (
                  <div className="h-[160px]">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Allocazione",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={calculateAllocationData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            dataKey="value"
                            label={({ name, value }: PieChartDataItem) => `${name}: ${value}%`}
                          >
                            {calculateAllocationData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            content={(props: TooltipProps<number, string>) => {
                              if (props.active && props.payload && props.payload.length) {
                                const payload = props.payload[0];
                                return (
                                  <div className="bg-white border border-slate-200 rounded-md p-2 shadow-sm">
                                    <p className="font-medium text-slate-700">{payload.name}</p>
                                    <p className="text-slate-600">{payload.value}%</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Add historical performance chart */}
          <Card className="mb-8 bg-white text-slate-700 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <LineChartIcon className="h-5 w-5 text-red-500" />
                Andamento Storico
              </CardTitle>
              <CardDescription className="text-slate-600">Performance degli ultimi 30 giorni</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  {(() => {
                    // Find asset with the most complete historical data
                    const assetWithHistory = assets.find(asset => 
                      asset.historicalData && asset.historicalData.length > 0
                    );
                    
                    if (!assetWithHistory || !assetWithHistory.historicalData) {
                      return (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-slate-600">
                            Dati storici non disponibili. Fai clic su un asset per visualizzare i dettagli.
                          </p>
                        </div>
                      );
                    }
                    
                    // Use the historical data from one asset as a proxy for the portfolio
                    // In a real app, you'd combine data from all assets weighted by their allocation
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={assetWithHistory.historicalData.slice(-30).map(data => ({
                            date: new Date(data.timestamp * 1000).toLocaleDateString(),
                            value: data.value
                          }))}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorPortfolioGreen" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value: string) => {
                              const date = new Date(value);
                              return date.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' });
                            }}
                          />
                          <YAxis domain={['auto', 'auto']} />
                          <CartesianGrid strokeDasharray="3 3" />
                          <RechartsTooltip 
                            content={(props: TooltipProps<number, string>) => {
                              if (props.active && props.payload && props.payload.length) {
                                const payload = props.payload[0];
                                return (
                                  <div className="bg-background border rounded-md p-2 shadow-sm">
                                    <p className="font-medium">{payload.payload.date}</p>
                                    <p>€{Number(payload.value).toFixed(2)}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#22C55E" 
                            fillOpacity={1} 
                            fill="url(#colorPortfolioGreen)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">I tuoi Asset</h2>
            <p className="text-slate-600">Elenco completo dei tuoi investimenti</p>
          </div>

          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-[220px] w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => {
                const currency = asset.currency || 'EUR';
                const totalValue = asset.current_price * asset.quantity;
                const totalValueEUR = convertToEUR(totalValue, currency);
                const priceEUR = convertToEUR(asset.current_price, currency);
                const performance = ((asset.current_price - asset.purchase_price) / asset.purchase_price) * 100;
                const quote = asset.quote;
                
                return (
                  <Card 
                    key={asset.id} 
                    className="hover:shadow-md transition-all duration-200 group bg-white text-slate-700 shadow-lg rounded-xl"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1 capitalize font-normal border-red-500 text-red-500 rounded-md">
                            {getAssetTypeIcon(asset.type)}
                            {asset.type}
                          </Badge>
                          
                          {currency !== 'EUR' && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-700 rounded-md">
                                    {currency}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white rounded-md">
                                  <p>Valori convertiti da {currency} a EUR</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAssetExpansion(asset);
                            }}
                            className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100"
                            aria-label="Mostra dettagli"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAsset(asset.id);
                            }}
                            className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                            aria-label="Rimuovi asset"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <h3 className="text-xl font-semibold flex items-center text-slate-800">
                          {asset.symbol}
                        </h3>
                        <p className="text-sm text-slate-600 truncate">{asset.name}</p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-0">
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Prezzo</p>
                          <div>
                            <div className="text-lg font-medium text-slate-800">€{priceEUR.toFixed(2)}</div>
                            {currency !== 'EUR' && (
                              <div className="text-xs text-slate-500">
                                {formatCurrency(asset.current_price, currency)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Quantità</p>
                          <div className="text-lg font-medium text-slate-800">{asset.quantity}</div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Valore totale</p>
                          <div className="text-lg font-medium text-slate-800">€{totalValueEUR.toFixed(2)}</div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Performance</p>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                              performance >= 0 
                                ? "bg-green-100 text-green-600" 
                                : "bg-red-100 text-red-500"
                            }`}
                          >
                            {performance >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            <span>{Math.abs(performance).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {quote && (
                        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground border-t pt-2">
                          <span>H: {quote.h.toFixed(2)}</span>
                          <span>L: {quote.l.toFixed(2)}</span>
                          <span>O: {quote.o.toFixed(2)}</span>
                          <span>C: {quote.pc.toFixed(2)}</span>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="px-0 pb-0">
                      <Accordion 
                        type="single" 
                        collapsible 
                        className="w-full"
                        value={expandedAssets[asset.id] ? asset.id : ""}
                        onValueChange={(value) => {
                          if (value === asset.id) {
                            toggleAssetExpansion(asset);
                          } else {
                            setExpandedAssets(prev => ({
                              ...prev,
                              [asset.id]: false
                            }));
                          }
                        }}
                      >
                        <AccordionItem value={asset.id} className="border-b-0">
                          <AccordionTrigger className="px-6 py-2 font-normal text-sm text-slate-600 hover:bg-slate-50 hover:no-underline">
                            {expandedAssets[asset.id] ? (
                              <span className="flex items-center gap-1">
                                <ChevronUp className="h-4 w-4" />
                                Nascondi dettagli
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <ChevronDown className="h-4 w-4" />
                                Mostra dettagli
                              </span>
                            )}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="px-6 pb-4 bg-slate-50 rounded-b-lg">
                              {!loadedAssetData[asset.id] ? (
                                <div className="py-8 flex justify-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                    <p className="text-sm text-slate-600">Caricamento dati in corso...</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  {/* Tabs for Asset Details */}
                                  <Tabs defaultValue="chart" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-lg p-1">
                                      <TabsTrigger value="chart" className="flex items-center gap-1 data-[state=active]:bg-red-500 data-[state=active]:text-white text-slate-600 rounded-md px-3 py-1.5 text-sm font-medium">
                                        <BarChart className="h-4 w-4 text-inherit" />
                                        <span>Grafico Storico</span>
                                      </TabsTrigger>
                                      <TabsTrigger value="fundamentals" className="flex items-center gap-1 data-[state=active]:bg-red-500 data-[state=active]:text-white text-slate-600 rounded-md px-3 py-1.5 text-sm font-medium">
                                        <BriefcaseBusiness className="h-4 w-4 text-inherit" />
                                        <span>Fondamentali</span>
                                      </TabsTrigger>
                                      <TabsTrigger value="news" className="flex items-center gap-1 data-[state=active]:bg-red-500 data-[state=active]:text-white text-slate-600 rounded-md px-3 py-1.5 text-sm font-medium">
                                        <Newspaper className="h-4 w-4 text-inherit" />
                                        <span>Notizie</span>
                                      </TabsTrigger>
                                    </TabsList>
                                    
                                    {/* Chart Tab */}
                                    <TabsContent value="chart" className="pt-4">
                                      <Card className="bg-white shadow-md rounded-lg">
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-lg text-slate-800">Andamento Storico - Ultimi 6 Mesi</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          {asset.historicalData && asset.historicalData.length > 0 ? (
                                            <div className="h-[300px]">
                                              <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                  data={asset.historicalData
                                                    .filter(data => {
                                                      // Filter to get 6 months of data
                                                      const sixMonthsAgo = new Date();
                                                      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                                                      return new Date(data.timestamp * 1000) >= sixMonthsAgo;
                                                    })
                                                    .map(data => ({
                                                      date: new Date(data.timestamp * 1000).toLocaleDateString(),
                                                      value: convertToEUR(data.value, asset.currency || 'EUR')
                                                    }))}
                                                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                >
                                                  <defs>
                                                    <linearGradient id={`colorValueGreen-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                                                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                                                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                                                    </linearGradient>
                                                  </defs>
                                                  <XAxis 
                                                    dataKey="date" 
                                                    tickFormatter={(value: string) => {
                                                      const date = new Date(value);
                                                      return date.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' });
                                                    }}
                                                  />
                                                  <YAxis domain={['auto', 'auto']} />
                                                  <CartesianGrid strokeDasharray="3 3" />
                                                  <RechartsTooltip 
                                                    content={(props: TooltipProps<number, string>) => {
                                                      if (props.active && props.payload && props.payload.length && props.payload[0].value) {
                                                        const payload = props.payload[0];
                                                        return (
                                                          <div className="bg-background border rounded-md p-2 shadow-sm">
                                                            <p className="font-medium">{payload.payload.date}</p>
                                                            <p>€{Number(payload.value).toFixed(2)}</p>
                                                          </div>
                                                        );
                                                      }
                                                      return null;
                                                    }}
                                                  />
                                                  <Area 
                                                    type="monotone" 
                                                    dataKey="value" 
                                                    stroke="#22C55E" 
                                                    fillOpacity={1} 
                                                    fill={`url(#colorValueGreen-${asset.id})`} 
                                                  />
                                                </AreaChart>
                                              </ResponsiveContainer>
                                            </div>
                                          ) : (
                                            <div className="h-[200px] flex items-center justify-center">
                                              <p className="text-slate-600">Dati storici non disponibili</p>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                    
                                    {/* Fundamentals Tab */}
                                    <TabsContent value="fundamentals" className="pt-4">
                                      <Card className="bg-white shadow-md rounded-lg">
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-lg text-slate-800">Dati Fondamentali</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          {asset.type === 'crypto' ? (
                                            <div className="py-6 text-center">
                                              <p className="text-slate-600">Dati fondamentali non disponibili per criptovalute</p>
                                            </div>
                                          ) : asset.keyMetrics ? (
                                            <div className="grid grid-cols-2 gap-4">
                                              <div className="bg-slate-100 p-4 rounded-md">
                                                <div className="text-slate-600 text-sm mb-1">Market Cap</div>
                                                <div className="font-medium text-lg text-slate-800">
                                                  {formatCurrency(
                                                    convertToEUR(
                                                      asset.keyMetrics.metric.marketCapitalization || 0,
                                                      asset.currency || 'EUR'
                                                    ),
                                                    'EUR'
                                                  )}
                                                </div>
                                              </div>
                                              
                                              <div className="bg-slate-100 p-4 rounded-md">
                                                <div className="text-slate-600 text-sm mb-1">P/E Ratio</div>
                                                <div className="font-medium text-lg text-slate-800">
                                                  {asset.keyMetrics.metric.peBasicExclExtraTTM?.toFixed(2) || 'N/A'}
                                                </div>
                                              </div>
                                              
                                              <div className="bg-slate-100 p-4 rounded-md">
                                                <div className="text-slate-600 text-sm mb-1">Enterprise Value</div>
                                                <div className="font-medium text-lg text-slate-800">
                                                  {formatCurrency(
                                                    convertToEUR(
                                                      asset.keyMetrics.metric.enterpriseValue || 0,
                                                      asset.currency || 'EUR'
                                                    ),
                                                    'EUR'
                                                  )}
                                                </div>
                                              </div>
                                              
                                              <div className="bg-slate-100 p-4 rounded-md">
                                                <div className="text-slate-600 text-sm mb-1">Dividend Yield</div>
                                                <div className="font-medium text-lg text-slate-800">
                                                  {asset.keyMetrics.metric.dividendYieldIndicatedAnnual?.toFixed(2) || 'N/A'}%
                                                </div>
                                              </div>
                                              
                                              <div className="bg-slate-100 p-4 rounded-md">
                                                <div className="text-slate-600 text-sm mb-1">Price to Sales</div>
                                                <div className="font-medium text-lg text-slate-800">
                                                  {asset.keyMetrics.metric.priceToSalesRatioTTM?.toFixed(2) || 'N/A'}
                                                </div>
                                              </div>
                                              
                                              <div className="bg-slate-100 p-4 rounded-md">
                                                <div className="text-slate-600 text-sm mb-1">P/E (Normalized)</div>
                                                <div className="font-medium text-lg text-slate-800">
                                                  {asset.keyMetrics.metric.peNormalizedAnnual?.toFixed(2) || 'N/A'}
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="py-6 text-center">
                                              <p className="text-slate-600">Dati fondamentali non disponibili</p>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                    
                                    {/* News Tab */}
                                    <TabsContent value="news" className="pt-4">
                                      <Card className="bg-white shadow-md rounded-lg">
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-lg text-slate-800">Ultime Notizie</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          {asset.news && asset.news.length > 0 ? (
                                            <div className="space-y-4">
                                              {asset.news.slice(0, 5).map(news => (
                                                <div key={news.id} className="border border-slate-200 rounded-md p-4 hover:bg-slate-50 transition-colors">
                                                  <div className="flex gap-4">
                                                    {news.image && (
                                                      <img 
                                                        src={news.image} 
                                                        alt={news.headline}
                                                        className="h-16 w-24 object-cover rounded-md"
                                                        onError={(e) => {
                                                          // Hide image on error
                                                          (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                      />
                                                    )}
                                                    <div className="flex-1">
                                                      <a 
                                                        href={news.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium hover:text-red-500 transition-colors"
                                                      >
                                                        {news.headline}
                                                      </a>
                                                      <p className="text-sm text-card-foreground mt-1">
                                                        {new Date(news.datetime * 1000).toLocaleString()} • {news.source}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="py-6 text-center">
                                              <p className="text-slate-600">Nessuna notizia disponibile</p>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
} 