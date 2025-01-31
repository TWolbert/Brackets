export function IconButton({ onClick, icon, text, className, disabled }: {
    onClick: () => void;
    icon: React.ReactNode;
    text: string;
    className?: string;
    disabled?: boolean;
}) {
    return (
        <button onClick={onClick} disabled={disabled} className={`bg-blue-500 px-3 py-2 text-white font-bold flex items-center rounded-md shadow-sm ${className}`}>
            {icon}
            <span className="ml-2">{text}</span>
        </button>
    )
}