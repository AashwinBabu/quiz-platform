
import { Box, Typography, Button, Divider } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
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

function AdminDashboard() {
    const navigate = useNavigate()

    const admin = JSON.parse(
        localStorage.getItem('currentUser') || 'null'
    )

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        navigate('/login')
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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 2.5, md: 6 },
                    py: 2.5,
                    borderBottom: STUDIO_TOKENS.border,
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={{ xs: 1, sm: 3 }}
                    flexWrap="wrap"
                >
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            color: STUDIO_TOKENS.obsidian,
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: 0,
                            '&:hover': {
                                backgroundColor: 'rgba(20, 20, 20, 0.05)'
                            }
                        }}
                    >
                        Back to Home
                    </Button>

                    <Typography
                        variant="h5"
                        fontWeight={800}
                        letterSpacing="-0.04em"
                        color={STUDIO_TOKENS.obsidian}
                    >
                        QuizUp.
                    </Typography>
                </Box>

                <Button
                    onClick={handleLogout}
                    variant="outlined"
                    startIcon={<LogoutOutlinedIcon sx={{ fontSize: 18 }} />}
                    sx={{
                        color: STUDIO_TOKENS.obsidian,
                        border: STUDIO_TOKENS.borderStrong,
                        borderRadius: 0,
                        px: 2.5,
                        py: 1.2,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        '&:hover': {
                            backgroundColor: STUDIO_TOKENS.gold,
                            borderColor: STUDIO_TOKENS.obsidian
                        }
                    }}
                >
                    Logout
                </Button>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    px: { xs: 2.5, sm: 4, md: 6 },
                    py: { xs: 4, md: 7 }
                }}
            >
                <Box sx={{ maxWidth: 1250, mx: 'auto' }}>
                    <Box mb={5}>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={2}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: STUDIO_TOKENS.gold,
                                    border: STUDIO_TOKENS.borderStrong
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
                                Administration Portal
                            </Typography>
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: '-0.04em',
                                lineHeight: 1.1,
                                textTransform: 'uppercase',
                                color: STUDIO_TOKENS.obsidian,
                                fontSize: { xs: '2rem', sm: '2.7rem', md: '3.2rem' }
                            }}
                        >
                            Welcome,{' '}
                            <Box
                                component="span"
                                sx={{ color: STUDIO_TOKENS.goldMuted }}
                            >
                                {admin?.name || 'Admin'}.
                            </Box>
                        </Typography>

                        <Typography
                            sx={{
                                color: STUDIO_TOKENS.textSecondary,
                                mt: 1.5,
                                fontSize: '0.95rem',
                                lineHeight: 1.7
                            }}
                        >
                            Manage your QuizUp platform from your administration dashboard.
                        </Typography>
                    </Box>

                    <Divider
                        sx={{
                            borderColor: 'rgba(20, 20, 20, 0.14)',
                            mb: 4
                        }}
                    />

                    <Box mb={3}>
                        <Typography
                            sx={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: STUDIO_TOKENS.textSecondary
                            }}
                        >
                            Dashboard Overview
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={800}
                            color={STUDIO_TOKENS.obsidian}
                            mt={1}
                        >
                            Platform Management
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)'
                            },
                            gap: 3
                        }}
                    >
                        <Box
                            component={Link}
                            to="/admin/questions"
                            sx={{
                                backgroundColor: STUDIO_TOKENS.surface,
                                border: STUDIO_TOKENS.borderStrong,
                                p: { xs: 3, md: 4 },
                                minHeight: 235,
                                textDecoration: 'none',
                                color: STUDIO_TOKENS.obsidian,
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '5px 5px 0px #F4C430'
                                },
                                '&:hover .card-arrow': {
                                    transform: 'translate(4px, -4px)'
                                }
                            }}
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: STUDIO_TOKENS.gold,
                                        border: STUDIO_TOKENS.borderStrong
                                    }}
                                >
                                    <QuizOutlinedIcon
                                        sx={{
                                            fontSize: 27,
                                            color: STUDIO_TOKENS.obsidian
                                        }}
                                    />
                                </Box>

                                <ArrowOutwardOutlinedIcon
                                    className="card-arrow"
                                    sx={{
                                        color: STUDIO_TOKENS.obsidian,
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            </Box>

                            <Box mt="auto">
                                <Typography
                                    sx={{
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.15em',
                                        color: STUDIO_TOKENS.goldMuted,
                                        textTransform: 'uppercase',
                                        mb: 1
                                    }}
                                >
                                    Question Bank
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                    color={STUDIO_TOKENS.obsidian}
                                >
                                    Manage Questions
                                </Typography>

                                <Typography
                                    sx={{
                                        color: STUDIO_TOKENS.textSecondary,
                                        mt: 1,
                                        fontSize: '0.9rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Add, edit, delete and view quiz questions.
                                </Typography>
                            </Box>

                            <Divider
                                sx={{
                                    borderColor: 'rgba(20, 20, 20, 0.14)',
                                    mt: 3,
                                    mb: 2
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: STUDIO_TOKENS.obsidian
                                }}
                            >
                                Manage Questions →
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default AdminDashboard
