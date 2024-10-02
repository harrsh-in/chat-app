import axios from '@/lib/api';
import { Box, Typography } from '@mui/material';

const Home = async () => {
    await pingServer();

    return (
        <Box>
            <Typography variant="body1">Hello, World!</Typography>
        </Box>
    );
};

export default Home;

const pingServer = async () => {
    await axios.get('/ping');
};
