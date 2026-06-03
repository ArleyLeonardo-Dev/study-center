interface Props {
    name: string;
    filled?: boolean;
    className?: string;
}

export default function MaterialIcon({
    name,
    filled = false,
    className = '',
}: Props) {
    return (
        <span
            className={`material-symbols-outlined ${filled ? 'material-symbols-filled' : ''} ${className}`}
            aria-hidden="true"
        >
            {name}
        </span>
    );
}
