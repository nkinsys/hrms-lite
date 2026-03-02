import { Badge as BaseBadge } from '@mui/material';
import { styled } from '@mui/system';

const Badge = styled(BaseBadge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        width: "16px",
        height: "16px",
        minWidth: "16px"
    },
}));

export default Badge;
