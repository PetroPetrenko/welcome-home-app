import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setFullName(data.full_name ?? "");
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // GSAP entrance animations
  useEffect(() => {
    if (loading || !cardRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7 }
    );

    if (avatarSectionRef.current) {
      tl.fromTo(
        avatarSectionRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5 },
        "-=0.3"
      );
    }

    if (formRef.current) {
      const fields = formRef.current.querySelectorAll(".form-field");
      tl.fromTo(
        fields,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      );
    }
  }, [loading]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", user.id);

    if (updateError) {
      toast({ title: "Update failed", description: updateError.message, variant: "destructive" });
    } else {
      setAvatarUrl(publicUrl + "?t=" + Date.now());
      toast({ title: "Avatar updated!" });

      // GSAP bounce animation on avatar
      if (avatarSectionRef.current) {
        gsap.fromTo(
          avatarSectionRef.current,
          { scale: 1.1 },
          { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" }
        );
      }
    }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <Header />

      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-2xl">
          {loading ? (
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-28 h-28 rounded-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ) : (
            <div
              ref={cardRef}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border"
              style={{ opacity: 0 }}
            >
              {/* Avatar Section */}
              <div ref={avatarSectionRef} className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <Avatar className="w-28 h-28 border-4 border-gold/30 shadow-xl">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={fullName || "Avatar"} />
                    ) : null}
                    <AvatarFallback className="bg-muted text-2xl font-display text-gold">
                      {getInitials(fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-gold text-primary-foreground cursor-pointer shadow-md transition-transform hover:scale-110"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </div>

                {uploading && (
                  <p className="mt-2 text-sm text-muted-foreground animate-pulse">Uploading...</p>
                )}

                <h1 className="text-2xl font-display font-bold text-foreground mt-4">
                  {fullName || "Your Profile"}
                </h1>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>

              {/* Profile Form */}
              <form ref={formRef} onSubmit={handleSave} className="space-y-5">
                <div className="form-field space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-field space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email ?? ""}
                    disabled
                    className="opacity-60"
                  />
                </div>

                <div className="form-field space-y-2">
                  <Label>Member since</Label>
                  <p className="text-sm text-muted-foreground">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

                <div className="form-field pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-gold text-primary-foreground hover:opacity-90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
