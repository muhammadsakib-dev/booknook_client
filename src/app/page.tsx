import { Footer } from "@/components/Footer";


export default function Home() {
  return (
  
      

  
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card border border-border rounded-xl p-8 sm:p-12 shadow-xs max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome to <span className="text-primary">BookNook</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            The Header, Navbar, and Footer components have been cloned based on
            your exact design specifications. All components are styled using
            the centralized variable color system with dark green primary
            accents.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-primary-subtle text-primary border border-primary/20 px-4 py-2 rounded-full font-medium">
              <span>Primary Dark Green Theme</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-medium">
              <span>Header + Navbar + Footer</span>
            </div>
          </div>
        </div>
      </main>

   
  );
}
