import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Twitter, Send } from "lucide-react";

const PROFILE_IMG = "https://i.ibb.co/7tNbF3k3/file-000000000f3461f7b9667cad34755326.png";

export const AuthorBio = () => {
  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16 border-2 border-primary">
          <AvatarImage src={PROFILE_IMG} alt="PHOENIX THE WEB3 SENSEI" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl font-bold">
            P
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold text-foreground">PHOENIX THE WEB3 SENSEI</h3>
          <p className="text-sm text-muted-foreground">@sensei_phoenixz</p>
          <p className="text-muted-foreground">
            Web3 community builder and crypto trading expert. Sharing insights on decentralized finance, 
            community growth strategies, and the future of blockchain technology.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="hover:border-primary/50 hover:text-primary transition-all"
          asChild
        >
          <a href="https://x.com/intent/follow?screen_name=sensei_phoenixz" target="_blank" rel="noreferrer" aria-label="Follow on X">
            <Twitter className="w-4 h-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hover:border-primary/50 hover:text-primary transition-all"
          asChild
        >
          <a href="https://t.me/sensei_phoenixz" target="_blank" rel="noreferrer" aria-label="Join Telegram">
            <Send className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
