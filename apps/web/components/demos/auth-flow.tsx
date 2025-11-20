"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Github, CheckCircle, LogOut } from "lucide-react";
import { CodeBlock } from "../ui/code-block";
import confetti from "canvas-confetti";
import { authClient } from "@template/auth/client";

export const AuthFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    await authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"]
        });
        setIsLoading(false);
      },
      onError: (ctx) => {
        alert(ctx.error.message);
        setIsLoading(false);
      }
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-[500px]">
      <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/50 p-8">
        {session ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Welcome, {session.user.name}!</h3>
            <p className="text-neutral-400 mb-6">You are securely authenticated.</p>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-sm space-y-4"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white">Welcome Back</h3>
              <p className="text-neutral-400">Sign in to your account</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@example.com"
                  className="w-full h-12 bg-neutral-950 border border-white/10 rounded-lg pl-10 pr-4 text-white focus:border-[var(--solar-teal)] focus:outline-none transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 bg-neutral-950 border border-white/10 rounded-lg pl-10 pr-4 text-white focus:border-[var(--solar-teal)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-[var(--solar-teal)] text-neutral-900 font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              ) : "Sign In"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-900 text-neutral-500">Or continue with</span>
              </div>
            </div>

            <button 
              onClick={() => authClient.signIn.social({ provider: "github" })}
              className="w-full h-12 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              <Github size={20} />
              GitHub
            </button>
          </motion.div>
        )}
      </div>

      <div className="hidden lg:block">
        <CodeBlock
          filename="apps/web/lib/auth-client.ts"
          code={`import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// Usage in component
const { data: session } = authClient.useSession();

const signIn = async () => {
  await authClient.signIn.email({
    email,
    password
  });
};`}
        />
      </div>
    </div>
  );
};
