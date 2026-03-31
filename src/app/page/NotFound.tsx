import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="text-xl text-muted-foreground">Halaman tidak ditemukan</p>
        <p className="text-sm text-muted-foreground max-w-md">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Button 
          className="mt-6 bg-primary hover:bg-primary/90"
          onClick={() => navigate("/")}
        >
          Kembali ke Dasbor
        </Button>
      </div>
    </div>
  );
}