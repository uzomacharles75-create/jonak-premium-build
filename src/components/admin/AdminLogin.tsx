import { useEffect, useState, type FormEvent } from "react";
import { LockKeyhole, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import logo from "@/assets/jonak-logo.jpeg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError, fetchCurrentUser, loginAdmin } from "@/lib/api";

export function AdminLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUserQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => (await fetchCurrentUser()).user,
    staleTime: 60 * 1000,
    retry: false,
    enabled: typeof window !== "undefined",
  });

  useEffect(() => {
    if (currentUserQuery.data) {
      void navigate({ to: "/admin/dashboard" });
    }
  }, [currentUserQuery.data, navigate]);

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: async (response) => {
      queryClient.setQueryData(["current-user"], response.user);
      await navigate({ to: "/admin/dashboard" });
    },
    onError: (error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    loginMutation.mutate({ email, password });
  };

  if (currentUserQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-white">
        <div className="flex items-center gap-3 text-sm text-white/70">
          <Loader2 className="h-4 w-4 animate-spin text-gold" />
          Checking access...
        </div>
      </div>
    );
  }

  if (currentUserQuery.error instanceof ApiError && currentUserQuery.error.status !== 401) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
          Unable to check admin session right now. Please continue to log in.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(210,170,92,0.15),_transparent_35%),linear-gradient(180deg,_var(--surface),_var(--background))] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <Card className="w-full max-w-md border-white/10 bg-white/5 text-white shadow-elegant backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-white/15">
                <img
                  src={logo}
                  alt="Jonak Construction Limited"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                Private Access
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold">Admin Login</h1>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Sign in to manage products, upload media, and update the public catalogue.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
                  Email
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-gold"
                  placeholder="admin@jonakconstruction.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
                  Password
                </label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-gold"
                  placeholder="Your password"
                />
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gold-gradient text-gold-foreground shadow-gold transition-transform hover:scale-[1.01]"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in
                  </>
                ) : (
                  <>
                    <LockKeyhole className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
