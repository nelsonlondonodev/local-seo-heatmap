import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onRemove: () => void;
}

/**
 * Atomic component for image uploading with preview.
 * Purely presentational and reusable.
 */
export function ImageUploader({ imagePreview, onImageSelect, onRemove }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all h-[180px] p-4 relative cursor-pointer
        ${imagePreview ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/40 hover:bg-primary/5'}`}
      onClick={() => !imagePreview && fileInputRef.current?.click()}
    >
      {imagePreview ? (
        <>
          <img src={imagePreview} className="h-full w-full object-cover rounded-lg" alt="Preview" />
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-3">
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-muted-foreground">Sube una foto real</p>
          <p className="text-[10px] text-muted-foreground mt-1 text-center">Analizaremos lo que hay en ella para el copy</p>
        </>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
