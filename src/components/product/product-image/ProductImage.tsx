import Image from "next/image"

interface Props {
    src?: string;
    alt: string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
    width: number;
    height: number;
    priority?: boolean;
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
    onMouseLeave?: () => void;
    onMouseEnter?: () => void
}

export const ProductImage = ({
    src,
    alt,
    className,
    width,
    height,
    style,
    priority,
    onMouseLeave,
    onMouseEnter
}: Props) => {
   
    
    const localSrc = (src)
        ? src.startsWith('http') // https://urlCompletoDeLaImagen.jpg
            ? src
            : `/products/${src}`
        : '/imgs/placeholder.jpg'
      
    return (
        <Image
            src={localSrc}
            width={width}
            height={height}
            alt={alt}
            priority={priority}
            className={className}
            style={style}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
        />
    )
}
