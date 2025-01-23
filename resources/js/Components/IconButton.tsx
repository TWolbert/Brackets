export function IconButton({ onClick, icon, text, className }: {
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
    className?: string;
}) {
    return (
        <button onClick={onClick} className={`bg-blue-500 px-3 py-2 text-white font-bold flex items-center rounded-md shadow-sm ${className}`}>
            {icon}
            <span className="ml-2">{text}</span>
        </button>
    )
}