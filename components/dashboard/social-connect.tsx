"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Send, Calendar, Check, Link2 } from "lucide-react";

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string | null;
  accountId: string | null;
  isActive: boolean;
  createdAt: string;
}

const PLATFORMS = [
  {
    id: "twitter",
    name: "Twitter / X",
    icon: "X",
    color: "bg-black",
    connectUrl: "/api/social/connect/twitter",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "in",
    color: "bg-blue-600",
    connectUrl: "/api/social/connect/linkedin",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "f",
    color: "bg-blue-500",
    connectUrl: "/api/social/connect/facebook",
  },
];

export function SocialConnect() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [postContent, setPostContent] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const res = await fetch("/api/social");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function connectAccount(platform: string) {
    const token = prompt(`Enter your ${platform} access token (or use OAuth):`);
    if (!token) return;

    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          accessToken: token,
          accountName: `${platform} Account`,
        }),
      });

      if (res.ok) {
        await fetchAccounts();
      }
    } catch (error) {
      console.error("Failed to connect account:", error);
    }
  }

  async function disconnectAccount(id: string) {
    if (!confirm("Disconnect this account?")) return;

    try {
      const res = await fetch(`/api/social?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAccounts(accounts.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error("Failed to disconnect account:", error);
    }
  }

  async function publishPost() {
    if (!selectedAccount || !postContent) return;

    setPosting(true);
    try {
      const res = await fetch("/api/social", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAccount,
          action: scheduledFor ? "schedule" : "post",
          content: postContent,
          scheduledFor,
        }),
      });

      if (res.ok) {
        setPostContent("");
        setScheduledFor("");
        setShowPostForm(false);
        alert(scheduledFor ? "Post scheduled successfully!" : "Post published successfully!");
      }
    } catch (error) {
      console.error("Failed to publish post:", error);
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Social Accounts</h3>
          <p className="text-sm text-slate-400">Connect your social media accounts to publish directly</p>
        </div>
        {accounts.length > 0 && (
          <Button onClick={() => setShowPostForm(true)}>
            <Send className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        )}
      </div>

      {showPostForm && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-white">Create Post</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-3 bg-dark-600 border border-white/10 rounded-xl text-white"
              >
                <option value="">Choose an account...</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.platform} - {account.accountName || "Connected"}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Post Content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What would you like to share?"
              rows={4}
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Schedule (optional)
              </label>
              <Input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Leave empty to publish immediately</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={publishPost} disabled={posting || !selectedAccount || !postContent}>
                {posting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {scheduledFor ? "Scheduling..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {scheduledFor ? "Schedule Post" : "Publish Now"}
                  </>
                )}
              </Button>
              <Button variant="ghost" onClick={() => setShowPostForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLATFORMS.map(platform => {
          const connected = accounts.find(a => a.platform === platform.id);
          return (
            <Card key={platform.id} className={connected ? "border-amber-500/30" : ""}>
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${platform.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                  {platform.icon}
                </div>
                <h4 className="font-semibold text-white mb-2">{platform.name}</h4>
                {connected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Connected</span>
                    </div>
                    <p className="text-xs text-slate-400">{connected.accountName}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => disconnectAccount(connected.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400">Not connected</p>
                    <Button variant="secondary" onClick={() => connectAccount(platform.id)}>
                      <Link2 className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-white">Connected Accounts</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts.map(account => (
                <div key={account.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${
                      account.platform === "twitter" ? "bg-black" :
                      account.platform === "linkedin" ? "bg-blue-600" :
                      "bg-blue-500"
                    } flex items-center justify-center text-white font-bold text-sm`}>
                      {account.platform === "twitter" ? "X" : account.platform === "linkedin" ? "in" : "f"}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{account.platform}</p>
                      <p className="text-sm text-slate-400">{account.accountName || "Connected"}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => disconnectAccount(account.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}