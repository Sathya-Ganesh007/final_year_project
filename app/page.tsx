import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Decorative background elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl dark:text-zinc-50">
          Analyze Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Data</span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Get deep insights and comprehensive analysis of your projects with our advanced tools.
        </p>
        
        <Link 
          href="/dashboard"
          className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-500 ease-out bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] rounded-2xl hover:bg-right hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95"
        >
          <span className="flex items-center">
            Start Analyzing
            <svg 
              className="w-6 h-6 ml-3 transition-transform duration-500 group-hover:translate-x-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Link>
      </div>
    </main> 
  );
}
