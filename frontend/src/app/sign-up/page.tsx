import { Box } from '@mui/material';
import SignupForm from './signup-form';
import axios from '@/lib/api';

const SignUp = async () => {
    await pingServer();
    return (
        <Box
            sx={{
                padding: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <SignupForm />
        </Box>
    );
};

export default SignUp;

const pingServer = async () => {
    return await axios.get('/ping');
};
