
import { Box, Typography, Button, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
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

function Landing() {
    const features = [
        {
            icon: <QuizOutlinedIcon />,
            title: 'Interactive Quizzes',
            desc: 'Explore multiple categories and challenge your knowledge.'
        },
        {
            icon: <TimerOutlinedIcon />,
            title: 'Timed Challenges',
            desc: 'Improve your speed and accuracy with timed quizzes.'
        },
        {
            icon: <EmojiEventsOutlinedIcon />,
            title: 'Leaderboard',
            desc: 'Track your performance and compete with other learners.'
        }
    ]

    return (
        <Box
            sx={{
                bgcolor: STUDIO_TOKENS.canvas,
                minHeight: '100vh',
                color: STUDIO_TOKENS.obsidian
            }}
        >
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    px: { xs: 2.5, md: 5 }
                }}
            >
                <Box
                    component="header"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2.5,
                        gap: 2,
                        flexWrap: 'wrap',
                        borderBottom: STUDIO_TOKENS.border
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={900}
                        letterSpacing="-0.05em"
                        sx={{ color: STUDIO_TOKENS.obsidian }}
                    >
                        QUIZ
                        <Box component="span" sx={{ color: STUDIO_TOKENS.goldMuted }}>
                            UP.
                        </Box>
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, sm: 2 }
                        }}
                    >
                        <Button
                            component={Link}
                            to="/login"
                            sx={{
                                color: STUDIO_TOKENS.obsidian,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                borderRadius: 0
                            }}
                        >
                            Login
                        </Button>

                        <Button
                            component={Link}
                            to="/signup"
                            variant="contained"
                            disableElevation
                            endIcon={<ArrowOutwardOutlinedIcon />}
                            sx={{
                                bgcolor: STUDIO_TOKENS.obsidian,
                                color: STUDIO_TOKENS.gold,
                                border: STUDIO_TOKENS.borderStrong,
                                borderRadius: 0,
                                px: { xs: 2, sm: 3 },
                                py: 1.3,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                '&:hover': {
                                    bgcolor: STUDIO_TOKENS.gold,
                                    color: STUDIO_TOKENS.obsidian
                                }
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 4, md: 7 },
                        py: { xs: 7, md: 12 },
                        flexDirection: { xs: 'column', md: 'row' }
                    }}
                >
                    <Box sx={{ flex: 1, width: '100%' }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={3}
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
                                    color: STUDIO_TOKENS.textSecondary,
                                    fontWeight: 700,
                                    letterSpacing: '0.18em',
                                    fontSize: '0.72rem'
                                }}
                            >
                                LEARN. CHALLENGE. ACHIEVE.
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: '2.7rem',
                                    sm: '3.5rem',
                                    md: '4.4rem'
                                },
                                fontWeight: 900,
                                lineHeight: 1.05,
                                letterSpacing: '-0.055em',
                                color: STUDIO_TOKENS.obsidian
                            }}
                        >
                            Knowledge is your{' '}
                            <Box
                                component="span"
                                sx={{ color: STUDIO_TOKENS.goldMuted }}
                            >
                                superpower.
                            </Box>
                        </Typography>

                        <Typography
                            sx={{
                                color: STUDIO_TOKENS.textSecondary,
                                fontSize: { xs: 15, md: 17 },
                                lineHeight: 1.8,
                                mt: 3,
                                maxWidth: 470
                            }}
                        >
                            Challenge yourself with interactive quizzes,
                            explore new topics, track your progress and
                            become the best version of yourself.
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                mt: 4,
                                flexWrap: 'wrap'
                            }}
                        >
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                disableElevation
                                endIcon={<ArrowOutwardOutlinedIcon />}
                                sx={{
                                    bgcolor: STUDIO_TOKENS.obsidian,
                                    color: STUDIO_TOKENS.gold,
                                    border: STUDIO_TOKENS.borderStrong,
                                    px: 3.5,
                                    py: 1.6,
                                    borderRadius: 0,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    '&:hover': {
                                        bgcolor: STUDIO_TOKENS.gold,
                                        color: STUDIO_TOKENS.obsidian
                                    }
                                }}
                            >
                                Start Learning
                            </Button>

                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                sx={{
                                    color: STUDIO_TOKENS.obsidian,
                                    border: STUDIO_TOKENS.borderStrong,
                                    px: 3.5,
                                    borderRadius: 0,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    '&:hover': {
                                        backgroundColor: 'rgba(20, 20, 20, 0.05)',
                                        borderColor: STUDIO_TOKENS.obsidian
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: '#EEECE6',
                            border: STUDIO_TOKENS.borderStrong,
                            p: { xs: 2.5, sm: 4, md: 5 },
                            minHeight: 340,
                            position: 'relative'
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                        >
                            <Typography
                                fontWeight={700}
                                fontSize="0.72rem"
                                letterSpacing="0.14em"
                                color={STUDIO_TOKENS.obsidian}
                            >
                                YOUR NEXT CHALLENGE
                            </Typography>

                            <Typography
                                color={STUDIO_TOKENS.goldMuted}
                                fontWeight={800}
                                fontSize="0.8rem"
                            >
                                01 / 03
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                backgroundColor: STUDIO_TOKENS.surface,
                                border: STUDIO_TOKENS.border,
                                p: { xs: 2.5, md: 3 },
                                mt: 4
                            }}
                        >
                            <Typography
                                color={STUDIO_TOKENS.goldMuted}
                                fontSize={11}
                                fontWeight={800}
                                letterSpacing="0.15em"
                            >
                                GENERAL KNOWLEDGE
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={900}
                                mt={2}
                                letterSpacing="-0.03em"
                            >
                                How much do you really know?
                            </Typography>

                            <Typography
                                color={STUDIO_TOKENS.textSecondary}
                                mt={2}
                                lineHeight={1.7}
                            >
                                Test your knowledge and discover something new.
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 4,
                                    mt: 3,
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <QuizOutlinedIcon
                                        sx={{ color: STUDIO_TOKENS.goldMuted }}
                                    />
                                    <Typography fontSize={13}>
                                        10 Questions
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                    <TimerOutlinedIcon
                                        sx={{ color: STUDIO_TOKENS.goldMuted }}
                                    />
                                    <Typography fontSize={13}>
                                        10 Minutes
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    backgroundColor: '#EAE8E1',
                                    height: 5,
                                    mt: 3,
                                    width: '100%'
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: STUDIO_TOKENS.gold,
                                        height: '100%',
                                        width: '65%'
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ py: { xs: 5, md: 8 } }}>
                    <Box textAlign="center" mb={5}>
                        <Typography
                            sx={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.18em',
                                color: STUDIO_TOKENS.textSecondary,
                                mb: 2
                            }}
                        >
                            WHY QUIZUP
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: { xs: '1.8rem', md: '2.5rem' },
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                color: STUDIO_TOKENS.obsidian
                            }}
                        >
                            Everything you need to grow.
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
                        {features.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    backgroundColor: STUDIO_TOKENS.surface,
                                    border: STUDIO_TOKENS.borderStrong,
                                    p: 3.5,
                                    minHeight: 200,
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '5px 5px 0px #F4C430'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: STUDIO_TOKENS.gold,
                                        border: STUDIO_TOKENS.borderStrong,
                                        color: STUDIO_TOKENS.obsidian,
                                        mb: 3
                                    }}
                                >
                                    {item.icon}
                                </Box>

                                <Typography
                                    fontWeight={800}
                                    fontSize={19}
                                    color={STUDIO_TOKENS.obsidian}
                                >
                                    {item.title}
                                </Typography>

                                <Typography
                                    color={STUDIO_TOKENS.textSecondary}
                                    mt={1}
                                    lineHeight={1.7}
                                    fontSize={14}
                                >
                                    {item.desc}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box
                    sx={{
                        backgroundColor: STUDIO_TOKENS.obsidian,
                        color: STUDIO_TOKENS.surface,
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        my: { xs: 5, md: 7 },
                        border: `1px solid ${STUDIO_TOKENS.obsidian}`
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            fontWeight: 900,
                            letterSpacing: '-0.04em'
                        }}
                    >
                        Ready to test your knowledge?
                    </Typography>

                    <Typography
                        sx={{
                            color: '#C4C1B9',
                            mt: 2,
                            fontSize: 15
                        }}
                    >
                        Your next learning challenge starts here.
                    </Typography>

                    <Button
                        component={Link}
                        to="/signup"
                        variant="contained"
                        disableElevation
                        endIcon={<ArrowOutwardOutlinedIcon />}
                        sx={{
                            mt: 3,
                            bgcolor: STUDIO_TOKENS.gold,
                            color: STUDIO_TOKENS.obsidian,
                            border: '1px solid #F4C430',
                            borderRadius: 0,
                            px: 4,
                            py: 1.6,
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            '&:hover': {
                                bgcolor: STUDIO_TOKENS.surface,
                                borderColor: STUDIO_TOKENS.surface
                            }
                        }}
                    >
                        Join Now
                    </Button>
                </Box>

                <Divider sx={{ borderColor: 'rgba(20, 20, 20, 0.14)' }} />

                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography
                        color={STUDIO_TOKENS.textSecondary}
                        fontSize={12}
                        letterSpacing="0.04em"
                    >
                        © 2026 QUIZUP. Learn something new every day.
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Landing
