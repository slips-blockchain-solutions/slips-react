import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

export default function AccountMenu() {
    const handleClick = (event) => {
        console.log(event)
    }
    return (
    <Button variant="text" onClick={handleClick}><Avatar /></Button>
    )
  }