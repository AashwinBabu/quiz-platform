
import { Box, Typography, Button, LinearProgress, Divider } from '@mui/material'
import { Link, useLocation, Navigate } from 'react-router-dom'
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

function Result() {
    const location = useLocation()
    const result = location.state

    if (!result) {
        return <Navigate to="/dashboard" replace />
    }

    const totalQuestions = result.totalQuestions || 0
    const score = result.score || 0
    const incorrect = totalQuestions - score

    const percentage = totalQuestions > 0
        ? Math.round((score / totalQuestions) * 100)
        : 0

    let performanceMessage = ''

    if (percentage >= 80) {
        performanceMessage = 'Excellent work! You performed really well.'
    } else if (percentage >= 60) {
        performanceMessage = 'Good job! Keep improving your knowledge.'
    } else if (percentage >= 40) {
        performanceMessage = 'Nice effort! A little more practice will help.'
    } else {
        performanceMessage = 'Keep practising. You can do better next time!'
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: STUDIO_TOKENS.canvas,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
                py: { xs: 3, md: 5 }
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 650,
                    backgroundColor: STUDIO_TOKENS.surface,
                    border: STUDIO_TOKENS.borderStrong,
                    p: { xs: 3, sm: 4, md: 5 },
                    textAlign: 'center'
                }}
            >
                <Box
                    sx={{
                        width: 75,
                        height: 75,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: STUDIO_TOKENS.gold,
                        border: STUDIO_TOKENS.borderStrong,
                        mx: 'auto',
                        mb: 3
                    }}
                >
                    <EmojiEventsOutlinedIcon
                        sx={{
                            fontSize: 42,
                            color: STUDIO_TOKENS.obsidian
                        }}
                    />
                </Box>

                <Typography
                    fontSize={11}
                    fontWeight={800}
                    letterSpacing="0.2em"
                    color={STUDIO_TOKENS.textSecondary}
                    mb={1.5}
                >
                    QUIZUP // PERFORMANCE REPORT
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight={900}
                    color={STUDIO_TOKENS.obsidian}
                    sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '-0.04em',
                        fontSize: { xs: '1.8rem', sm: '2.3rem' }
                    }}
                >
                    Quiz Completed!
                </Typography>

                <Typography
                    color={STUDIO_TOKENS.textSecondary}
                    mt={2}
                    lineHeight={1.7}
                >
                    {performanceMessage}
                </Typography>

                <Divider
                    sx={{
                        my: 3,
                        borderColor: 'rgba(20,20,20,0.14)'
                    }}
                />

                <Box sx={{ my: 4 }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 58, md: 76 },
                            fontWeight: 900,
                            color: STUDIO_TOKENS.goldMuted,
                            lineHeight: 1.1,
                            letterSpacing: '-0.05em'
                        }}
                    >
                        {percentage}%
                    </Typography>

                    <Typography
                        color={STUDIO_TOKENS.textSecondary}
                        fontSize={12}
                        fontWeight={700}
                        letterSpacing="0.15em"
                        mt={1}
                    >
                        YOUR OVERALL SCORE
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                            height: 10,
                            borderRadius: 0,
                            mt: 3,
                            backgroundColor: '#EAE8E2',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: STUDIO_TOKENS.gold,
                                borderRadius: 0
                            }
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: { xs: 1, sm: 2 },
                        mb: 4
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: STUDIO_TOKENS.canvas,
                            border: STUDIO_TOKENS.border,
                            p: { xs: 1.5, sm: 2.5 }
                        }}
                    >
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            color={STUDIO_TOKENS.obsidian}
                            sx={{ fontSize: { xs: '1.7rem', sm: '2rem' } }}
                        >
                            {totalQuestions}
                        </Typography>

                        <Typography
                            color={STUDIO_TOKENS.textSecondary}
                            fontSize={12}
                            mt={0.5}
                        >
                            Total
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: '#F0F5EF',
                            border: '1px solid #C9DCC7',
                            p: { xs: 1.5, sm: 2.5 }
                        }}
                    >
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            color="#287A48"
                            sx={{ fontSize: { xs: '1.7rem', sm: '2rem' } }}
                        >
                            {score}
                        </Typography>

                        <Typography
                            color={STUDIO_TOKENS.textSecondary}
                            fontSize={12}
                            mt={0.5}
                        >
                            Correct
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: '#FAEFEC',
                            border: '1px solid #E8C9C1',
                            p: { xs: 1.5, sm: 2.5 }
                        }}
                    >
                        <Typography
                            variant="h4"
                            fontWeight={900}
                            color="#B85042"
                            sx={{ fontSize: { xs: '1.7rem', sm: '2rem' } }}
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

                <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowOutwardOutlinedIcon />}
                    disableElevation
                    sx={{
                        backgroundColor: STUDIO_TOKENS.obsidian,
                        color: STUDIO_TOKENS.gold,
                        border: STUDIO_TOKENS.borderStrong,
                        py: 1.8,
                        borderRadius: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        '&:hover': {
                            backgroundColor: STUDIO_TOKENS.gold,
                            color: STUDIO_TOKENS.obsidian
                        }
                    }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        </Box>
    )
}

export default Result
