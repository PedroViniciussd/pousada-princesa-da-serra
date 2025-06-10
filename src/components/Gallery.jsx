// src/components/Gallery.tsx

interface GalleryProps {
    images: string[];
}

export default function Gallery({ images }: GalleryProps) {
    return (
        <section className="max-w-7xl mx-auto p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt={`Pousada Princesa da Serra - imagem ${i + 1}`}
                    className="rounded-lg object-cover w-full h-48"
                    loading="lazy"
                />
            ))}
        </section>
    );
}
