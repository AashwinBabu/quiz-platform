
import { Box, Typography, Button, Divider } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
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

function UserDashboard() {
    const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || 'null'
    )

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        navigate('/login')
    }

    const cardStyle = {
        backgroundColor: STUDIO_TOKENS.surface,
        border: STUDIO_TOKENS.border,
        p: { xs: 2.5, md: 3 },
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 230,
        transition: '0.25s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            border: STUDIO_TOKENS.borderStrong,
            boxShadow: '0 10px 25px rgba(20,20,20,0.07)',
            '& .card-icon': {
                backgroundColor: STUDIO_TOKENS.gold
            },
            '& .card-link': {
                color: STUDIO_TOKENS.goldMuted
            }
        }
    }

    const cards = [
        {
            title: 'Take a Quiz',
            description: 'Choose a category and test your knowledge.',
            action: 'Start Quiz',
            path: '/quiz',
            icon: QuizOutlinedIcon
        },
        {
            title: 'Leaderboard',
            description: 'See how you rank against other users.',
            action: 'View Leaderboard',
            path: '/leaderboard',
            icon: EmojiEventsOutlinedIcon
        },
        {
            title: 'My Attempts',
            description: 'Review your previous quiz performance.',
            action: 'View Attempts',
            path: '/my-attempts',
            icon: HistoryOutlinedIcon
        }
    ]

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: STUDIO_TOKENS.canvas,
                color: STUDIO_TOKENS.obsidian
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                    px: { xs: 2.5, md: 6 },
                    py: 2.5,
                    borderBottom: STUDIO_TOKENS.border
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={{ xs: 2, sm: 3 }}
                    flexWrap="wrap"
                >
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: STUDIO_TOKENS.textSecondary,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            borderRadius: 0,
                            '&:hover': {
                                backgroundColor: 'rgba(20,20,20,0.05)',
                                color: STUDIO_TOKENS.obsidian
                            }
                        }}
                    >
                        Back to Home
                    </Button>

                    <Typography
                        variant="h5"
                        fontWeight={900}
                        color={STUDIO_TOKENS.obsidian}
                        letterSpacing="-0.05em"
                    >
                        QuizUp.
                    </Typography>
                </Box>

                <Button
                    onClick={handleLogout}
                    variant="outlined"
                    startIcon={<LogoutOutlinedIcon />}
                    sx={{
                        borderColor: STUDIO_TOKENS.obsidian,
                        color: STUDIO_TOKENS.obsidian,
                        borderRadius: 0,
                        px: 2.5,
                        py: 1.1,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
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
                    maxWidth: 1200,
                    mx: 'auto',
                    px: { xs: 2.5, sm: 4, md: 6 },
                    py: { xs: 5, md: 7 }
                }}
            >
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
                            fontSize={11}
                            fontWeight={800}
                            letterSpacing="0.18em"
                            color={STUDIO_TOKENS.textSecondary}
                        >
                            YOUR LEARNING SPACE
                        </Typography>
                    </Box>

                    <Typography
                        variant="h3"
                        fontWeight={900}
                        color={STUDIO_TOKENS.obsidian}
                        sx={{
                            fontSize: { xs: '2rem', sm: '2.7rem', md: '3.2rem' },
                            letterSpacing: '-0.05em',
                            lineHeight: 1.15
                        }}
                    >
                        Welcome,
                        <Box
                            component="span"
                            sx={{ color: STUDIO_TOKENS.goldMuted }}
                        >
                            {' '}{currentUser?.name || 'User'}!
                        </Box>
                    </Typography>

                    <Typography
                        color={STUDIO_TOKENS.textSecondary}
                        mt={1.5}
                        fontSize={15}
                    >
                        Ready to test your knowledge today?
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        borderColor: 'rgba(20,20,20,0.14)',
                        mb: 4
                    }}
                />

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    mb={3}
                >
                    <Typography
                        fontWeight={900}
                        fontSize={13}
                        letterSpacing="0.12em"
                        color={STUDIO_TOKENS.obsidian}
                    >
                        YOUR ACTIVITIES
                    </Typography>

                    <Typography
                        fontSize={12}
                        color={STUDIO_TOKENS.textSecondary}
                    >
                        Choose where you want to go
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
                        gap: 2.5
                    }}
                >
                    {cards.map((card) => {
                        const Icon = card.icon

                        return (
                            <Box
                                key={card.title}
                                component={Link}
                                to={card.path}
                                sx={cardStyle}
                            >
                                <Box
                                    className="card-icon"
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: STUDIO_TOKENS.canvas,
                                        border: STUDIO_TOKENS.border,
                                        transition: '0.25s'
                                    }}
                                >
                                    <Icon
                                        sx={{
                                            fontSize: 28,
                                            color: STUDIO_TOKENS.obsidian
                                        }}
                                    />
                                </Box>

                                <Typography
                                    variant="h6"
                                    fontWeight={900}
                                    color={STUDIO_TOKENS.obsidian}
                                    mt={2.5}
                                    letterSpacing="-0.02em"
                                >
                                    {card.title}
                                </Typography>

                                <Typography
                                    color={STUDIO_TOKENS.textSecondary}
                                    mt={1}
                                    fontSize={13}
                                    lineHeight={1.7}
                                >
                                    {card.description}
                                </Typography>

                                <Box
                                    className="card-link"
                                    display="flex"
                                    alignItems="center"
                                    gap={0.8}
                                    mt="auto"
                                    pt={2.5}
                                    sx={{
                                        color: STUDIO_TOKENS.obsidian,
                                        transition: '0.25s'
                                    }}
                                >
                                    <Typography
                                        fontWeight={800}
                                        fontSize={11}
                                        letterSpacing="0.1em"
                                        textTransform="uppercase"
                                    >
                                        {card.action}
                                    </Typography>

                                    <ArrowOutwardOutlinedIcon
                                        sx={{ fontSize: 16 }}
                                    />
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </Box>
    )
}

export default UserDashboard
