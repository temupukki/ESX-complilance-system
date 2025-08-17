
import Dash from "@/components/Dash";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <div>  
        <Dash/>
        {children}
    
      </div>
     
  );
}
