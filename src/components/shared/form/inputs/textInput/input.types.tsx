export type ButtonProps = {
    children: any;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: (event: React.MouseEvent) => void;
    form?: string,
    id?: string,
    isLoading?: boolean,
}