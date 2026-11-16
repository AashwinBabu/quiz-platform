
import { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    LinearProgress,
    Divider
} from '@mui/material'
import { Link } from 'react-router-dom'
import AxiosConfig from '../services/AxiosConfig'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
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

function MyAttempts() {
    const [attempts, setAttempts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || 'null'
    )

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const response = await AxiosConfig.get('/attempts')

                const userAttempts = response.data
                    .filter(
                        (attempt) =>
                            String(attempt.userId) === String(currentUser?.id)
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.date) - new Date(a.date)
                    )

                setAttempts(userAttempts)
            } catch {
                setError('Unable to load your quiz attempts.')
            } finally {
                setLoading(false)
            }
        }

        fetchAttempts()
    }, [])

    const getPerformance = (percentage) => {
        if (percentage >= 80) return 'Excellent'
        if (percentage >= 60) return 'Good'
        if (percentage >= 40) return 'Average'
        return 'Needs Improvement'
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: STUDIO_TOKENS.canvas,
                color: STUDIO_TOKENS.textPrimary
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
                <Button
                    component={Link}
                    to="/dashboard"
                    startIcon={<ArrowBackOutlinedIcon />}
                    sx={{
                        color: STUDIO_TOKENS.obsidian,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
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
                        color: STUDIO_TOKENS.textSecondary
                    }}
                >
                    QUIZUP // HISTORY
                </Typography>
            </Box>

            <Box
                sx={{
                    maxWidth: 950,
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 5 },
                    py: { xs: 4, md: 6 }
                }}
            >
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
                            Your Performance
                        </Typography>
                    </Box>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1,
                            textTransform: 'uppercase',
                            fontSize: { xs: '2rem', sm: '2.7rem', md: '3.2rem' }
                        }}
                    >
                        My
                        <Box
                            component="span"
                            sx={{ color: STUDIO_TOKENS.goldMuted }}
                        >
                            {' '}Attempts.
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
                        Review your previous quiz performance.
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
                        alignItems="center"
                        justifyContent="center"
                        py={8}
                        gap={2}
                    >
                        <CircularProgress
                            sx={{ color: STUDIO_TOKENS.goldMuted }}
                        />

                        <Typography color={STUDIO_TOKENS.textSecondary}>
                            Loading your attempts...
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
                ) : attempts.length === 0 ? (
                    <Box
                        sx={{
                            backgroundColor: STUDIO_TOKENS.surface,
                            border: STUDIO_TOKENS.borderStrong,
                            p: { xs: 3, md: 5 },
                            textAlign: 'center'
                        }}
                    >
                        <HistoryOutlinedIcon
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
                            No Attempts Yet
                        </Typography>

                        <Typography
                            color={STUDIO_TOKENS.textSecondary}
                            mt={1}
                        >
                            Complete your first quiz to see your results here.
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
                    <Box display="flex" flexDirection="column" gap={3}>
                        {attempts.map((attempt) => {
                            const incorrect =
                                attempt.totalQuestions - attempt.score

                            return (
                                <Box
                                    key={attempt.id}
                                    sx={{
                                        backgroundColor: STUDIO_TOKENS.surface,
                                        border: STUDIO_TOKENS.borderStrong,
                                        p: { xs: 2.5, sm: 3, md: 4 }
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        flexWrap="wrap"
                                        gap={2}
                                    >
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                fontWeight={900}
                                                color={STUDIO_TOKENS.obsidian}
                                                sx={{
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '-0.02em'
                                                }}
                                            >
                                                Quiz Attempt
                                            </Typography>

                                            <Typography
                                                color={STUDIO_TOKENS.textSecondary}
                                                fontSize={13}
                                                mt={0.5}
                                            >
                                                {new Date(attempt.date).toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                backgroundColor: STUDIO_TOKENS.gold,
                                                px: 2,
                                                py: 0.8
                                            }}
                                        >
                                            <Typography
                                                fontWeight={800}
                                                fontSize={12}
                                                color={STUDIO_TOKENS.obsidian}
                                                letterSpacing="0.06em"
                                            >
                                                {getPerformance(attempt.percentage).toUpperCase()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider
                                        sx={{
                                            my: 3,
                                            borderColor: 'rgba(20, 20, 20, 0.14)'
                                        }}
                                    />

                                    <Box
                                        display="grid"
                                        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                                        gap={{ xs: 1.5, sm: 3 }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="h4"
                                                fontWeight={900}
                                                color={STUDIO_TOKENS.obsidian}
                                                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                                            >
                                                {attempt.totalQuestions}
                                            </Typography>

                                            <Typography
                                                color={STUDIO_TOKENS.textSecondary}
                                                fontSize={12}
                                                mt={0.5}
                                            >
                                                Total
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                variant="h4"
                                                fontWeight={900}
                                                color="#287A48"
                                                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                                            >
                                                {attempt.score}
                                            </Typography>

                                            <Typography
                                                color={STUDIO_TOKENS.textSecondary}
                                                fontSize={12}
                                                mt={0.5}
                                            >
                                                Correct
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                variant="h4"
                                                fontWeight={900}
                                                color="#B85042"
                                                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                                            >
                                                {incorrect}
                                            </Typography>

                                            <Typography
                                                color={STUDIO_TOKENS.textSecondary}
                                                fontSize={12}
                                                mt={0.5}
                                            >
                                                Incorrect
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box mt={3}>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={1.5}
                                        >
                                            <Typography
                                                fontWeight={800}
                                                fontSize={13}
                                                color={STUDIO_TOKENS.obsidian}
                                                letterSpacing="0.08em"
                                            >
                                                SCORE
                                            </Typography>

                                            <Typography
                                                fontWeight={900}
                                                color={STUDIO_TOKENS.obsidian}
                                            >
                                                {attempt.percentage}%
                                            </Typography>
                                        </Box>

                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(
                                                100,
                                                Math.max(0, Number(attempt.percentage) || 0)
                                            )}
                                            sx={{
                                                height: 10,
                                                borderRadius: 0,
                                                backgroundColor: '#EAE8E2',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: STUDIO_TOKENS.gold,
                                                    borderRadius: 0
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default MyAttempts
