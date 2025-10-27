'use client'
import { verifyEmail } from "@/services/AuthService";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const t = urlParams.get('token') || '';
      setToken(t);
      console.log("token", t);
    }
  }, []);

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) {
        setError("No verification token found.");
        setIsLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        setError(err.message || "Verification failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      handleVerify();
    }
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Verifying email...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        {error && (
          <button
            onClick={() => router.push("/register")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to Register
          </button>
        )}
      </div>
    </div>
  );
}

export default Page;