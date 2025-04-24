"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { CreateAccountForm } from "@/components/auth/create-account-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CombinedAuth() {
  const [activeTab, setActiveTab] = useState("login");
  
  return (
    <div className="border rounded-xl shadow-xl overflow-hidden bg-gradient-to-b from-black/70 to-black/40 backdrop-blur-sm">
      <Tabs 
        defaultValue="login" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b border-white/10">
          <TabsList className="grid w-full grid-cols-2 my-4 px-4 mx-auto max-w-md bg-transparent">
            <TabsTrigger 
              value="login" 
              className="text-base py-2.5 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              Log In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="text-base py-2.5 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-6 sm:p-8">
          <TabsContent value="login" className="mt-0 animate-fade-in focus-visible:outline-none focus-visible:ring-0">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="signup" className="mt-0 animate-fade-in focus-visible:outline-none focus-visible:ring-0">
            <CreateAccountForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 