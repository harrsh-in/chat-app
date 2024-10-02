'use client';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import { get } from 'lodash';
import { MouseEvent, useState } from 'react';
import {
    FieldErrors,
    FieldValues,
    Path,
    UseFormRegister,
} from 'react-hook-form';

const PasswordInput = <T extends FieldValues>({
    register,
    errors,
    name,
    disabled,
}: PasswordHookFormInputProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const error = errors[name];
    const errorMessage = get(error, `message`, '');

    return (
        <FormControl variant="outlined" fullWidth disabled={disabled}>
            <InputLabel htmlFor={name} error={!!error}>
                Password
            </InputLabel>

            <OutlinedInput
                id={name}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register(name)}
                error={!!error}
                endAdornment={
                    <InputAdornment
                        position="end"
                        disablePointerEvents={disabled}
                    >
                        <IconButton
                            aria-label="Toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            disabled={disabled}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />

            {error && (
                <FormHelperText error={!!error}>{errorMessage}</FormHelperText>
            )}
        </FormControl>
    );
};

export default PasswordInput;

interface PasswordHookFormInputProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
    disabled?: boolean;
}
