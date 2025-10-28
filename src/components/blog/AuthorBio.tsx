import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Github } from "lucide-react";

export const AuthorBio = () => {
  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16 border-2 border-primary">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl font-bold">
            P
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold text-foreground">PH0ENIX_WEB3</h3>
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
        >
          <Twitter className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hover:border-primary/50 hover:text-primary transition-all"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hover:border-primary/50 hover:text-primary transition-all"
        >
          <Github className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
