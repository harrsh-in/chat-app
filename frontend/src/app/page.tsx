import axios from '@/lib/api';
import { Container, Typography } from '@mui/material';

const Home = async () => {
    await pingServer();

    return (
        <Container>
            <Typography variant="body1">Hello, World!</Typography>
        </Container>
    );
};

export default Home;

const pingServer = async () => {
    await axios.get('/ping');
};
