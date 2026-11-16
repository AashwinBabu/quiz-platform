
import { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Divider
} from '@mui/material'
import { Link } from 'react-router-dom'
import AxiosConfig from '../services/AxiosConfig'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
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

function Leaderboard() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await AxiosConfig.get('/attempts')
                const attempts = response.data

                const userScores = {}

                attempts.forEach((attempt) => {
                    const userId = attempt.userId

                    if (!userScores[userId]) {
                        userScores[userId] = {
                            userId,
                            name: attempt.userName,
                            totalScore: 0,
                            totalQuestions: 0,
                            attempts: 0
                        }
                    }

                    userScores[userId].totalScore += Number(attempt.score) || 0
                    userScores[userId].totalQuestions += Number(attempt.totalQuestions) || 0
                    userScores[userId].attempts += 1
                })

                const leaderboard = Object.values(userScores)
                    .map((user) => ({
                        ...user,
                        percentage: user.totalQuestions > 0
                            ? Math.round(
                                (user.totalScore / user.totalQuestions) * 100
                            )
                            : 0
                    }))
                    .sort((a, b) => b.percentage - a.percentage)

                setUsers(leaderboard)
            } catch {
                setError('Unable to load leaderboard.')
            } finally {
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    const getRankColor = (index) => {
        if (index === 0) return STUDIO_TOKENS.goldMuted
        if (index === 1) return '#777777'
        if (index === 2) return '#A87950'
        return STUDIO_TOKENS.textSecondary
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: { xs: 2.5, md: 6 },
                    py: 2.5,
                    borderBottom: STUDIO_TOKENS.border,
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >
                <Button
                    component={Link}
                    to="/dashboard"
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
                    Back to Dashboard
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
                    QUIZUP // RANKINGS
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    px: { xs: 2, sm: 4 },
                    py: { xs: 4, md: 6 }
                }}
            >
                <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                    <Box mb={4}>
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
                                Performance Rankings
                            </Typography>
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                lineHeight: 1.1,
                                textTransform: 'uppercase',
                                color: STUDIO_TOKENS.obsidian,
                                fontSize: { xs: '2rem', sm: '2.7rem', md: '3.2rem' }
                            }}
                        >
                            Leader
                            <Box
                                component="span"
                                sx={{ color: STUDIO_TOKENS.goldMuted }}
                            >
                                board.
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
                            See how you rank against other quiz participants.
                        </Typography>
                    </Box>

                    <Divider
                        sx={{
                            borderColor: 'rgba(20, 20, 20, 0.14)',
                            mb: 4
                        }}
                    />

                    {loading ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            py={8}
                            gap={2}
                        >
                            <CircularProgress
                                sx={{ color: STUDIO_TOKENS.goldMuted }}
                            />

                            <Typography color={STUDIO_TOKENS.textSecondary}>
                                Loading leaderboard...
                            </Typography>
                        </Box>
                    ) : error ? (
                        <Box
                            sx={{
                                backgroundColor: STUDIO_TOKENS.surface,
                                border: STUDIO_TOKENS.borderStrong,
                                p: 4
                            }}
                        >
                            <Typography color="#B85042" fontWeight={700}>
                                {error}
                            </Typography>
                        </Box>
                    ) : users.length === 0 ? (
                        <Box
                            sx={{
                                backgroundColor: STUDIO_TOKENS.surface,
                                border: STUDIO_TOKENS.borderStrong,
                                p: { xs: 3, md: 5 },
                                textAlign: 'center'
                            }}
                        >
                            <EmojiEventsOutlinedIcon
                                sx={{
                                    fontSize: 55,
                                    color: STUDIO_TOKENS.goldMuted
                                }}
                            />

                            <Typography
                                variant="h5"
                                fontWeight={900}
                                color={STUDIO_TOKENS.obsidian}
                                mt={2}
                            >
                                No Rankings Yet
                            </Typography>

                            <Typography
                                color={STUDIO_TOKENS.textSecondary}
                                mt={1}
                            >
                                Complete a quiz to appear on the leaderboard.
                            </Typography>

                            <Button
                                component={Link}
                                to="/quiz"
                                variant="contained"
                                endIcon={<ArrowOutwardOutlinedIcon />}
                                disableElevation
                                sx={{
                                    mt: 3,
                                    backgroundColor: STUDIO_TOKENS.obsidian,
                                    color: STUDIO_TOKENS.gold,
                                    border: STUDIO_TOKENS.borderStrong,
                                    borderRadius: 0,
                                    px: 3,
                                    py: 1.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    '&:hover': {
                                        backgroundColor: STUDIO_TOKENS.gold,
                                        color: STUDIO_TOKENS.obsidian
                                    }
                                }}
                            >
                                Take a Quiz
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                backgroundColor: STUDIO_TOKENS.surface,
                                border: STUDIO_TOKENS.borderStrong,
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '55px minmax(0, 1fr) 75px',
                                        sm: '75px minmax(0, 1fr) 110px 110px'
                                    },
                                    gap: { xs: 1, sm: 2 },
                                    alignItems: 'center',
                                    px: { xs: 1.5, sm: 3 },
                                    py: 2.5,
                                    backgroundColor: STUDIO_TOKENS.obsidian,
                                    color: STUDIO_TOKENS.surface
                                }}
                            >
                                <Typography
                                    fontSize={12}
                                    fontWeight={700}
                                    letterSpacing="0.1em"
                                >
                                    RANK
                                </Typography>

                                <Typography
                                    fontSize={12}
                                    fontWeight={700}
                                    letterSpacing="0.1em"
                                >
                                    USER
                                </Typography>

                                <Typography
                                    fontSize={12}
                                    fontWeight={700}
                                    letterSpacing="0.1em"
                                    textAlign="center"
                                >
                                    ATTEMPTS
                                </Typography>

                                <Typography
                                    sx={{
                                        display: { xs: 'none', sm: 'block' },
                                        fontSize: 12,
                                        fontWeight: 700,
                                        letterSpacing: '0.1em',
                                        textAlign: 'center'
                                    }}
                                >
                                    SCORE
                                </Typography>
                            </Box>

                            {users.map((user, index) => (
                                <Box
                                    key={user.userId || index}
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '55px minmax(0, 1fr) 75px',
                                            sm: '75px minmax(0, 1fr) 110px 110px'
                                        },
                                        gap: { xs: 1, sm: 2 },
                                        alignItems: 'center',
                                        px: { xs: 1.5, sm: 3 },
                                        py: 2.5,
                                        borderBottom: STUDIO_TOKENS.border,
                                        backgroundColor: index === 0
                                            ? '#FFFBEA'
                                            : STUDIO_TOKENS.surface
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={0.5}
                                    >
                                        {index === 0 && (
                                            <EmojiEventsOutlinedIcon
                                                sx={{
                                                    fontSize: 17,
                                                    color: STUDIO_TOKENS.goldMuted,
                                                    display: { xs: 'none', sm: 'block' }
                                                }}
                                            />
                                        )}

                                        <Typography
                                            fontWeight={800}
                                            color={getRankColor(index)}
                                        >
                                            #{index + 1}
                                        </Typography>
                                    </Box>

                                    <Box minWidth={0}>
                                        <Typography
                                            fontWeight={800}
                                            color={STUDIO_TOKENS.obsidian}
                                            sx={{ overflowWrap: 'anywhere' }}
                                        >
                                            {user.name}
                                        </Typography>

                                        <Typography
                                            fontSize={12}
                                            color={STUDIO_TOKENS.textSecondary}
                                            sx={{
                                                display: { xs: 'block', sm: 'none' },
                                                mt: 0.5
                                            }}
                                        >
                                            Score: {user.percentage}%
                                        </Typography>
                                    </Box>

                                    <Typography
                                        textAlign="center"
                                        color={STUDIO_TOKENS.textSecondary}
                                        fontWeight={600}
                                    >
                                        {user.attempts}
                                    </Typography>

                                    <Typography
                                        textAlign="center"
                                        fontWeight={900}
                                        color={STUDIO_TOKENS.obsidian}
                                        sx={{
                                            display: { xs: 'none', sm: 'block' },
                                            fontSize: '1.05rem'
                                        }}
                                    >
                                        {user.percentage}%
                                    </Typography>
                                </Box>
                            ))}

                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: STUDIO_TOKENS.canvas
                                }}
                            >
                                <Typography
                                    fontSize={12}
                                    color={STUDIO_TOKENS.textSecondary}
                                    textAlign="center"
                                >
                                    Rankings are calculated using each user's overall quiz percentage.
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default Leaderboard
