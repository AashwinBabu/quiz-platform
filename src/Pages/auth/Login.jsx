import { useState } from 'react'
import { Box, Typography, TextField, Button, Divider, Stack, Alert } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import AxiosConfig from '../../services/AxiosConfig'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined'

const STUDIO_TOKENS = {
    canvas: '#F9F8F6',
    surface: '#FFFFFF',
    obsidian: '#141414',
    gold: '#F4C430',
    goldMuted: '#D9A71C',
    textPrimary: '#141414',
    textSecondary: '#66635E',
    border: '1px solid rgba(20, 20, 20, 0.14)',
    borderStrong: '1px solid #141414'
}

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setMessage('')
        setLoading(true)

        try {
            const response = await AxiosConfig.get('/users')

            const loggedUser = response.data.find(
                (user) =>
                    user.email === email &&
                    user.password === password
            )

            if (!loggedUser) {
                setMessage('Invalid email or password')
                return
            }

            const currentUser = {
                id: loggedUser.id,
                name: loggedUser.name,
                email: loggedUser.email,
                role: loggedUser.role
            }

            localStorage.setItem(
                'currentUser',
                JSON.stringify(currentUser)
            )

            if (loggedUser.role === 'admin') {
                navigate('/admin/dashboard')
            } else {
                navigate('/dashboard')
            }
        } catch (error) {
            setMessage('Unable to login. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const inputSx = {
        mb: 3,
        '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            backgroundColor: STUDIO_TOKENS.canvas,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            '& fieldset': {
                border: STUDIO_TOKENS.border
            },
            '&:hover fieldset': {
                borderColor: STUDIO_TOKENS.obsidian
            },
            '&.Mui-focused': {
                backgroundColor: STUDIO_TOKENS.surface
            },
            '&.Mui-focused fieldset': {
                borderColor: STUDIO_TOKENS.obsidian,
                borderWidth: '1.5px'
            }
        },
        '& .MuiInputBase-input': {
            py: 1.65,
            px: 2,
            color: STUDIO_TOKENS.textPrimary
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: STUDIO_TOKENS.canvas,
                color: STUDIO_TOKENS.textPrimary
            }}
        >
            {/* Top Architectural Navigation Bar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 2.5, md: 6 },
                    py: 2.5,
                    borderBottom: STUDIO_TOKENS.border
                }}
            >
                <Button
                    component={Link}
                    to="/"
                    startIcon={<ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                        color: STUDIO_TOKENS.obsidian,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: 0,
                        px: 1.5,
                        py: 0.75,
                        '&:hover': {
                            backgroundColor: 'rgba(20, 20, 20, 0.05)'
                        }
                    }}
                >
                    Back to Home
                </Button>

                <Typography
                    sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: STUDIO_TOKENS.textSecondary
                    }}
                >
                    MEMBER ACCESS // 01
                </Typography>
            </Box>

            {/* Centered Editorial Auth Frame */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: { xs: 2, sm: 4 },
                    py: { xs: 4, md: 6 }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '480px',
                        backgroundColor: STUDIO_TOKENS.surface,
                        border: STUDIO_TOKENS.borderStrong,
                        p: { xs: 3.5, sm: 5.5 },
                        position: 'relative'
                    }}
                >
                    {/* Eyebrow Badge */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: STUDIO_TOKENS.gold,
                                border: '1px solid #141414'
                            }}
                        />
                        <Typography
                            sx={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: STUDIO_TOKENS.textSecondary
                            }}
                        >
                            Sign In Portal
                        </Typography>
                    </Stack>

                    {/* Oversized Studio Heading */}
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.05,
                            textTransform: 'uppercase',
                            color: STUDIO_TOKENS.obsidian,
                            fontSize: { xs: '2rem', sm: '2.5rem' }
                        }}
                    >
                        Welcome{' '}
                        <Box
                            component="span"
                            sx={{
                                color: STUDIO_TOKENS.goldMuted
                            }}
                        >
                            Back.
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            color: STUDIO_TOKENS.textSecondary,
                            mt: 1.5,
                            mb: 4,
                            fontSize: '0.95rem',
                            lineHeight: 1.6
                        }}
                    >
                        Login to continue your learning journey and track your quiz standings.
                    </Typography>

                    <Divider sx={{ borderColor: 'rgba(20, 20, 20, 0.12)', mb: 4 }} />

                    {/* Form */}
                    <Box component="form" onSubmit={handleLogin}>
                        <Typography
                            sx={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: STUDIO_TOKENS.obsidian,
                                mb: 1
                            }}
                        >
                            Email Address
                        </Typography>

                        <TextField
                            fullWidth
                            type="email"
                            placeholder="name@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={inputSx}
                        />

                        <Typography
                            sx={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: STUDIO_TOKENS.obsidian,
                                mb: 1
                            }}
                        >
                            Password
                        </Typography>

                        <TextField
                            fullWidth
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            sx={inputSx}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disableElevation
                            disabled={loading}
                            endIcon={!loading && <ArrowOutwardOutlinedIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                mt: 1,
                                backgroundColor: STUDIO_TOKENS.obsidian,
                                color: STUDIO_TOKENS.gold,
                                border: STUDIO_TOKENS.borderStrong,
                                borderRadius: 0,
                                py: 1.75,
                                px: 3,
                                textTransform: 'uppercase',
                                letterSpacing: '0.14em',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                    backgroundColor: STUDIO_TOKENS.gold,
                                    color: STUDIO_TOKENS.obsidian
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(20, 20, 20, 0.2)',
                                    color: 'rgba(20, 20, 20, 0.5)'
                                }
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Box>

                    {message && (
                        <Alert
                            severity="error"
                            sx={{
                                mt: 3,
                                borderRadius: 0,
                                border: '1px solid #B85042',
                                backgroundColor: '#FDF4F2',
                                color: '#8F2D21',
                                fontSize: '0.85rem',
                                fontWeight: 500
                            }}
                        >
                            {message}
                        </Alert>
                    )}

                    <Divider sx={{ borderColor: 'rgba(20, 20, 20, 0.12)', mt: 4, mb: 3 }} />

                    {/* Footer Signup Link */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        gap={1}
                    >
                        <Typography
                            sx={{
                                fontSize: '0.88rem',
                                color: STUDIO_TOKENS.textSecondary
                            }}
                        >
                            Don&apos;t have an account?
                        </Typography>

                        <Box
                            component={Link}
                            to="/signup"
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: STUDIO_TOKENS.obsidian,
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                borderBottom: `2px solid ${STUDIO_TOKENS.gold}`,
                                pb: 0.25,
                                transition: 'opacity 0.2s ease',
                                '&:hover': {
                                    opacity: 0.75
                                }
                            }}
                        >
                            Sign up
                            <ArrowOutwardOutlinedIcon sx={{ fontSize: 15 }} />
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default Login