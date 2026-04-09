import { Sparkles } from "lucide-react";

interface LoadingScreenProps {
  message: string;
  submessage?: string;
}

const LoadingScreen = ({ message, submessage }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center animate-fade-up">
        <div className="w-16 h-16 mx-auto mb-6 gradient-warm rounded-2xl flex items-center justify-center animate-float">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
          {message}
        </h2>
        {submessage && (
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">{submessage}</p>
        )}
        <div className="flex justify-center gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
