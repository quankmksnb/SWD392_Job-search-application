import FloatingInput from "@/components/ui/Floating/FloatingInput";
import Image from "next/image";

export default function HomeTest() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 relative">
        <Image
          src="/images/img-register/buyer_dweb_individual.jpg"
          alt="ebay-register-individual"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8">Create an account</h1>

          <div className="flex mb-6 bg-gray-100 rounded-full p-1">
            <button className="flex-1 py-2 px-4 bg-black text-white rounded-full">
              Personal
            </button>
            <button className="flex-1 py-2 px-4 text-gray-600">Business</button>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput
                label="First name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <FloatingInput
                label="Last name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <FloatingInput
              label="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />

            <div className="relative">
              <FloatingInput
                label="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                👁️
              </button>
            </div>

            <p className="text-xs text-gray-600">
              By selecting <strong>Create personal account</strong>, you agree
              to our{" "}
              <a href="#" className="text-blue-600 underline">
                User Agreement
              </a>{" "}
              and acknowledge reading our{" "}
              <a href="#" className="text-blue-600 underline">
                User Privacy Notice
              </a>
            </p>

            <button
              type="submit"
              className="w-full py-3 bg-gray-400 text-white rounded-lg font-medium"
            >
              Create personal account
            </button>

            <div className="text-center text-gray-600 my-4">
              or continue with
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center font-bold py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center font-bold py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg
                  className="w-5 h-5 mr-3 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
