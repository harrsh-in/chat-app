'use client';

import PasswordInput from '@/components/PasswordInput';
import axios from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Paper, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { get } from 'lodash';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignupForm = () => {
    const [isUsernameValidated, setIsUsernameValidated] = useState(false);

    const { mutate: mutateValidatedUsername } = useMutation({
        mutationKey: ['validate-username'],
        mutationFn: validateUsername,
        onSuccess(data, variables, context) {
            console.log('Data:', {
                data,
                variables,
                context,
            });

            setIsUsernameValidated(true);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<signupFormType>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            publicKey: 'test',
            privateKey: 'test',
        },
    });

    const onSubmit = (data: signupFormType) => {
        console.log('Form Data:', data);
    };

    const handleValidateUsername = () => {
        try {
            mutateValidatedUsername(getValues('username'));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Paper
            sx={{
                padding: 4,
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 300,
                    gap: 2,
                }}
            >
                <TextField
                    label="Username"
                    {...register('username')}
                    autoFocus
                    fullWidth
                    error={!!errors.username}
                    helperText={get(errors, 'username.message', '')}
                    variant="outlined"
                />

                {isUsernameValidated ? (
                    <Fragment>
                        <PasswordInput
                            register={register}
                            errors={errors}
                            name="password"
                        />

                        <PasswordInput
                            register={register}
                            errors={errors}
                            name="confirmPassword"
                        />

                        <Button
                            type="submit"
                            variant="outlined"
                            color={
                                Object.keys(errors).length ? 'error' : 'primary'
                            }
                        >
                            Sign Up
                        </Button>
                    </Fragment>
                ) : (
                    <Button
                        variant="outlined"
                        onClick={() => handleValidateUsername}
                    >
                        Validate Username
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default SignupForm;

const signupFormSchema = z
    .object({
        username: z
            .string({
                message: 'Invalid username.',
            })
            .min(1, {
                message: 'Invalid username.',
            }),
        password: z
            .string({
                message: 'Password must be at least 8 characters long.',
            })
            .min(8, {
                message: 'Password must be at least 8 characters long.',
            }),
        confirmPassword: z
            .string({
                message: 'Passwords do not match.',
            })
            .min(8, {
                message: 'Password must be at least 8 characters long.',
            }),
        publicKey: z
            .string({
                message: 'Invalid public key.',
            })
            .min(1, {
                message: 'Invalid public key.',
            }),
        privateKey: z
            .string({
                message: 'Invalid private key.',
            })
            .min(1, {
                message: 'Invalid private key.',
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

type signupFormType = z.infer<typeof signupFormSchema>;

const validateUsername = async (username: string) => {
    return await axios.post('/validate-username', {
        username,
    });
};
