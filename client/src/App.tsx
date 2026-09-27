import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TV from "./pages/TV";
import Join from "./pages/Join";
import Room from "@/pages/Room";
import Admin from "@/pages/Admin";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/tv" component={TV} /><Route path="/TV" component={TV} /><Route path="/join/:code" component={Join} /><Route path="/room/:code" component={Room} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster theme="dark" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
