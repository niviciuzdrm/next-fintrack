import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans flex flex-col min-h-screen items-center justify-center p-8 sm:p-20 bg-background">
      <main className="flex flex-col gap-10 items-center">
        <div className="flex gap-2 mb-6 items-center">
          <span className="text-sm text-muted-foreground align-center">
            feito com
          </span>
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={90}
            height={20}
            priority
            className="dark:invert"
          />
        </div>
        <h1 className="text-4xl font-bold text-center mb-2">
          Bem-vindo ao Fintrack
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-6 max-w-xl">
          Gerencie suas finanças pessoais, acompanhe despesas, receitas e
          investimentos em um só lugar.
        </p>
        <Link href="/login">
          <button className="rounded-full bg-primary text-white px-8 py-3 text-lg font-semibold shadow hover:bg-primary/90 transition">
            Comece agora
          </button>
        </Link>
      </main>
      <footer className="mt-16 flex gap-6 flex-wrap items-center justify-center text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Fintrack</span>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
        <a
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Next.js
        </a>
      </footer>
    </div>
  );
}