import { useState } from 'react'
import { Box, Typography, TextField, Button, Divider, Stack } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import AxiosConfig from '../../services/AxiosConfig'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined'

function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setMessage('')
        setLoading(true)

        try {
            const response = await AxiosConfig.get('/users')
            const existingUser = response.data.find(
                (user) => user.email === email
            )

            if (existingUser) {
                setMessage('Email already registered')
                return
            }

            await AxiosConfig.post('/users', {
                name,
                email,
                password,
                role: 'user'
            })

            navigate('/login')
        } catch (error) {
            setMessage('Unable to create account. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#F9F8F6',
                color: '#141414'
            }}
        >
            <Box
                sx={{
                    px: { xs: 3, md: 6 },
                    py: 2.5,
                    borderBottom: '1px solid rgba(20, 20, 20, 0.12)'
                }}
            >
                <Button
                    component={Link}
                    to="/"
                    startIcon={<ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                        color: '#141414',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        '&:hover': {
                            backgroundColor: 'rgba(20, 20, 20, 0.05)'
                        }
                    }}
                >
                    Back to Home
                </Button>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '450px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #141414',
                        p: { xs: 3.5, sm: 5 }
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: '#B88917',
                            mb: 1
                        }}
                    >
                        New Member
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: '#141414',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Create your account.
                    </Typography>

                    <Typography sx={{ color: '#6E6A64', mt: 1, mb: 3.5, fontSize: '0.95rem' }}>
                        Start your learning journey with us.
                    </Typography>

                    <Divider sx={{ mb: 3.5, borderColor: 'rgba(20, 20, 20, 0.1)' }} />

                    <Box component="form" onSubmit={handleSignup}>
                        <Typography fontWeight={600} fontSize="0.85rem" mb={1}>
                            Full name
                        </Typography>

                        <TextField
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                    backgroundColor: '#F9F8F6',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#141414',
                                        borderWidth: '1.5px'
                                    }
                                }
                            }}
                        />

                        <Typography fontWeight={600} fontSize="0.85rem" mb={1}>
                            Email address
                        </Typography>

                        <TextField
                            fullWidth
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                    backgroundColor: '#F9F8F6',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#141414',
                                        borderWidth: '1.5px'
                                    }
                                }
                            }}
                        />

                        <Typography fontWeight={600} fontSize="0.85rem" mb={1}>
                            Password
                        </Typography>

                        <TextField
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            inputProps={{ minLength: 6 }}
                            sx={{
                                mb: 3.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                    backgroundColor: '#F9F8F6',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#141414',
                                        borderWidth: '1.5px'
                                    }
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disableElevation
                            disabled={loading}
                            endIcon={!loading && <ArrowOutwardOutlinedIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                backgroundColor: '#141414',
                                color: '#F4C430',
                                borderRadius: 0,
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '15px',
                                fontWeight: 700,
                                '&:hover': {
                                    backgroundColor: '#F4C430',
                                    color: '#141414'
                                }
                            }}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Box>

                    {message && (
                        <Typography color="error" mt={2.5} textAlign="center" fontSize="0.9rem">
                            {message}
                        </Typography>
                    )}

                    <Divider sx={{ mt: 3.5, mb: 2.5, borderColor: 'rgba(20, 20, 20, 0.1)' }} />

                    <Stack direction="row" justifyContent="center" spacing={0.75}>
                        <Typography color="#6E6A64" fontSize="0.9rem">
                            Already have an account?
                        </Typography>
                        <Link
                            to="/login"
                            style={{
                                color: '#141414',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                textDecorationColor: '#F4C430',
                                textUnderlineOffset: '4px'
                            }}
                        >
                            Login
                        </Link>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default Signup