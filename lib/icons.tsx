import { MdDescription, MdWarning, MdAssignment, MdMedicalServices, MdEvent, MdAccountBalance, MdShield } from 'react-icons/md';

const iconProps = {
    className: 'w-6 h-6',
};

export const ContractIcon = () => <MdDescription {...iconProps} className="w-6 h-6 text-[#1F2D7F]" />;
export const MessageIcon = () => <MdWarning {...iconProps} className="w-6 h-6 text-orange-500" />;
export const ReturnIcon = () => <MdAssignment {...iconProps} className="w-6 h-6 text-green-600" />;
export const PrescriptionIcon = () => <MdMedicalServices {...iconProps} className="w-6 h-6 text-red-500" />;
export const MeetingIcon = () => <MdEvent {...iconProps} className="w-6 h-6 text-blue-600" />;
export const GovernmentIcon = () => <MdAccountBalance {...iconProps} className="w-6 h-6 text-slate-700" />;
export const WarrantyIcon = () => <MdShield {...iconProps} className="w-6 h-6 text-purple-600" />;

// Header dropdown icons (smaller)
export const ContractIconSmall = () => <MdDescription className="w-5 h-5 text-[#1F2D7F]" />;
export const MessageIconSmall = () => <MdWarning className="w-5 h-5 text-orange-500" />;
export const ReturnIconSmall = () => <MdAssignment className="w-5 h-5 text-green-600" />;
export const PrescriptionIconSmall = () => <MdMedicalServices className="w-5 h-5 text-red-500" />;
export const MeetingIconSmall = () => <MdEvent className="w-5 h-5 text-blue-600" />;
export const GovernmentIconSmall = () => <MdAccountBalance className="w-5 h-5 text-slate-700" />;
export const WarrantyIconSmall = () => <MdShield className="w-5 h-5 text-purple-600" />;

// Get icon by mode
export function getIconForMode(mode: string, small = false) {
    const iconMap = {
        contract: small ? <ContractIconSmall /> : <ContractIcon />,
        message: small ? <MessageIconSmall /> : <MessageIcon />,
        returns: small ? <ReturnIconSmall /> : <ReturnIcon />,
        prescription: small ? <PrescriptionIconSmall /> : <PrescriptionIcon />,
        meeting: small ? <MeetingIconSmall /> : <MeetingIcon />,
        government: small ? <GovernmentIconSmall /> : <GovernmentIcon />,
        warranty: small ? <WarrantyIconSmall /> : <WarrantyIcon />,
    };
    return iconMap[mode as keyof typeof iconMap] || null;
}
