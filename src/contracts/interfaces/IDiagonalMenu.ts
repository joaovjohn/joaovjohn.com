export interface IMenuItemProps {
    label: string;
    onClick: () => void;
    index: number;
    isSelected: boolean;
    onHover: () => void;
    totalItems: number;
}