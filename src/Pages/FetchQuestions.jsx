
import { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    LinearProgress,
    CircularProgress,
    Alert,
    Button,
    Divider,
    Stack
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AxiosConfig from '../services/AxiosConfig'
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

const API_URL = 'https://opentdb.com'

const categories = [
    { id: 9, name: 'General Knowledge' },
    { id: 17, name: 'Science & Nature' },
    { id: 21, name: 'Sports' }
]

const difficulties = ['easy', 'medium', 'hard']
const QUESTIONS_PER_COMBINATION = 20

const decodeText = (text) => {
    const decoded = decodeURIComponent(text)
    const textarea = document.createElement('textarea')
    textarea.innerHTML = decoded
    return textarea.value
}

const fetchQuestions = async (categoryId, difficulty) => {
    const url =
        `${API_URL}/api.php?amount=${QUESTIONS_PER_COMBINATION}` +
        `&category=${categoryId}` +
        `&difficulty=${difficulty}` +
        '&type=multiple&encode=url3986'

    const response = await AxiosConfig.get(url)

    if (
        response.data.response_code === 0 &&
        response.data.results.length === QUESTIONS_PER_COMBINATION
    ) {
        return response.data.results
    }

    return []
}

const formatQuestions = (results, category, difficulty) => {
    return results.map((item) => {
        const correctAnswer = decodeText(item.correct_answer)

        const options = [
            correctAnswer,
            ...item.incorrect_answers.map(decodeText)
        ]

        return {
            question: decodeText(item.question),
            options: options.sort(() => Math.random() - 0.5),
            correctAnswer,
            category: category.name,
            categoryId: category.id,
            difficulty,
            type: item.type,
            source: 'Open Trivia DB'
        }
    })
}

function FetchQuestions() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [savedCount, setSavedCount] = useState(0)
    const [completedCount, setCompletedCount] = useState(0)
    const [skippedCount, setSkippedCount] = useState(0)
    const [current, setCurrent] = useState('Preparing question import...')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const combinations = categories.flatMap((category) =>
        difficulties.map((difficulty) => ({
            category,
            difficulty
        }))
    )

    useEffect(() => {
        let active = true

        const importQuestions = async () => {
            try {
                setLoading(true)

                const existingResponse = await AxiosConfig.get('/questions')

                if (!active) return

                const existingQuestions = [...existingResponse.data]

                const existingTexts = new Set(
                    existingQuestions.map((question) =>
                        question.question?.trim().toLowerCase()
                    )
                )

                const completedCombinations = combinations.filter(
                    ({ category, difficulty }) => {
                        const count = existingQuestions.filter(
                            (question) =>
                                Number(question.categoryId) === category.id &&
                                question.difficulty?.toLowerCase() === difficulty
                        ).length

                        return count >= QUESTIONS_PER_COMBINATION
                    }
                )

                const pendingCombinations = combinations.filter(
                    ({ category, difficulty }) => {
                        const count = existingQuestions.filter(
                            (question) =>
                                Number(question.categoryId) === category.id &&
                                question.difficulty?.toLowerCase() === difficulty
                        ).length

                        return count < QUESTIONS_PER_COMBINATION
                    }
                )

                let completed = completedCombinations.length
                let skipped = 0
                let saved = 0

                setCompletedCount(completed)

                if (pendingCombinations.length === 0) {
                    setSavedCount(0)
                    setProgress(9)
                    setMessage(
                        'All 9 combinations already have at least 20 questions.'
                    )
                    return
                }

                setCurrent('Fetching questions from Open Trivia DB...')

                const results = await Promise.allSettled(
                    pendingCombinations.map(async ({ category, difficulty }) => {
                        const existingCount = existingQuestions.filter(
                            (question) =>
                                Number(question.categoryId) === category.id &&
                                question.difficulty?.toLowerCase() === difficulty
                        ).length

                        const requiredCount =
                            QUESTIONS_PER_COMBINATION - existingCount

                        const apiResults = await fetchQuestions(
                            category.id,
                            difficulty
                        )

                        if (apiResults.length !== QUESTIONS_PER_COMBINATION) {
                            return {
                                completed: false,
                                skipped: true,
                                saved: 0
                            }
                        }

                        const newQuestions = formatQuestions(
                            apiResults,
                            category,
                            difficulty
                        ).filter((question) => {
                            const questionText = question.question
                                .trim()
                                .toLowerCase()

                            if (existingTexts.has(questionText)) {
                                return false
                            }

                            existingTexts.add(questionText)
                            return true
                        })

                        if (newQuestions.length < requiredCount) {
                            return {
                                completed: false,
                                skipped: true,
                                saved: 0
                            }
                        }

                        const questionsToSave = newQuestions.slice(
                            0,
                            requiredCount
                        )

                        const saveResults = await Promise.allSettled(
                            questionsToSave.map((question) =>
                                AxiosConfig.post('/questions', question)
                            )
                        )

                        const successfulSaves = saveResults.filter(
                            (result) => result.status === 'fulfilled'
                        ).length

                        return {
                            completed:
                                existingCount + successfulSaves >=
                                QUESTIONS_PER_COMBINATION,
                            skipped:
                                existingCount + successfulSaves <
                                QUESTIONS_PER_COMBINATION,
                            saved: successfulSaves
                        }
                    })
                )

                if (!active) return

                results.forEach((result) => {
                    if (result.status === 'fulfilled') {
                        saved += result.value.saved

                        if (result.value.completed) {
                            completed++
                        } else if (result.value.skipped) {
                            skipped++
                        }
                    } else {
                        skipped++
                    }

                    setSavedCount(saved)
                    setCompletedCount(completed)
                    setSkippedCount(skipped)
                    setProgress((previous) => previous + 1)
                })

                setCurrent('Import completed')

                setMessage(
                    `Import finished. ${completed} combinations completed, ${saved} new questions saved and ${skipped} combinations skipped or unsuccessful.`
                )
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        'Unable to import questions.'
                    )
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        importQuestions()

        return () => {
            active = false
        }
    }, [])

    const percentage = (progress / 9) * 100

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
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >
                <Button
                    onClick={() => navigate('/admin/dashboard')}
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
                    Admin Dashboard
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
                    QUESTION IMPORT // 01
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    px: { xs: 2, sm: 4 },
                    py: { xs: 4, md: 6 }
                }}
            >
                <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                    <Box mb={4}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
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
                                Automated Question Import
                            </Typography>
                        </Stack>

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.1,
                                textTransform: 'uppercase',
                                color: STUDIO_TOKENS.obsidian,
                                fontSize: { xs: '2rem', sm: '2.7rem' }
                            }}
                        >
                            Question{' '}
                            <Box
                                component="span"
                                sx={{ color: STUDIO_TOKENS.goldMuted }}
                            >
                                Import.
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
                            Import questions automatically from Open Trivia DB.
                        </Typography>

                        <Typography
                            sx={{
                                color: STUDIO_TOKENS.textSecondary,
                                mt: 1,
                                fontSize: '0.85rem'
                            }}
                        >
                            20 questions per category and difficulty combination · Total target: 180 questions
                        </Typography>
                    </Box>

                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: STUDIO_TOKENS.surface,
                            border: STUDIO_TOKENS.borderStrong,
                            borderRadius: 0
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2.5, md: 4.5 } }}>
                            {loading && (
                                <Box textAlign="center" mb={4}>
                                    <CircularProgress
                                        size={45}
                                        sx={{ color: STUDIO_TOKENS.goldMuted }}
                                    />

                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                        mt={2}
                                        color={STUDIO_TOKENS.obsidian}
                                    >
                                        {current}
                                    </Typography>

                                    <Typography
                                        color={STUDIO_TOKENS.textSecondary}
                                        mt={1}
                                    >
                                        Please wait while questions are imported.
                                    </Typography>
                                </Box>
                            )}

                            <Box mb={4}>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    flexWrap="wrap"
                                    gap={1}
                                    mb={1.5}
                                >
                                    <Typography
                                        fontSize="0.75rem"
                                        fontWeight={700}
                                        letterSpacing="0.12em"
                                        textTransform="uppercase"
                                        color={STUDIO_TOKENS.obsidian}
                                    >
                                        Import Progress
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                        color={STUDIO_TOKENS.textSecondary}
                                    >
                                        {progress} / 9
                                    </Typography>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={percentage}
                                    sx={{
                                        height: 10,
                                        borderRadius: 0,
                                        backgroundColor: '#ECEAE5',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: STUDIO_TOKENS.gold,
                                            borderRadius: 0
                                        }
                                    }}
                                />
                            </Box>

                            <Box
                                display="grid"
                                gridTemplateColumns={{
                                    xs: '1fr',
                                    sm: '1fr 1fr'
                                }}
                                gap={2}
                                mb={4}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: STUDIO_TOKENS.canvas,
                                        border: STUDIO_TOKENS.border,
                                        p: 3
                                    }}
                                >
                                    <Typography
                                        color={STUDIO_TOKENS.textSecondary}
                                        fontSize={13}
                                        fontWeight={600}
                                    >
                                        NEW QUESTIONS SAVED
                                    </Typography>

                                    <Typography
                                        variant="h3"
                                        fontWeight={800}
                                        color={STUDIO_TOKENS.obsidian}
                                        mt={1}
                                    >
                                        {savedCount}
                                    </Typography>

                                    <Box
                                        sx={{
                                            width: 35,
                                            height: 4,
                                            backgroundColor: STUDIO_TOKENS.gold,
                                            mt: 2
                                        }}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        backgroundColor: STUDIO_TOKENS.canvas,
                                        border: STUDIO_TOKENS.border,
                                        p: 3
                                    }}
                                >
                                    <Typography
                                        color={STUDIO_TOKENS.textSecondary}
                                        fontSize={13}
                                        fontWeight={600}
                                    >
                                        COMPLETED COMBINATIONS
                                    </Typography>

                                    <Typography
                                        variant="h3"
                                        fontWeight={800}
                                        color={STUDIO_TOKENS.obsidian}
                                        mt={1}
                                    >
                                        {completedCount} / 9
                                    </Typography>

                                    <Box
                                        sx={{
                                            width: 35,
                                            height: 4,
                                            backgroundColor: STUDIO_TOKENS.gold,
                                            mt: 2
                                        }}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        backgroundColor: STUDIO_TOKENS.canvas,
                                        border: STUDIO_TOKENS.border,
                                        p: 3,
                                        gridColumn: { sm: '1 / -1' }
                                    }}
                                >
                                    <Typography
                                        color={STUDIO_TOKENS.textSecondary}
                                        fontSize={13}
                                        fontWeight={600}
                                    >
                                        SKIPPED COMBINATIONS
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={800}
                                        color={STUDIO_TOKENS.obsidian}
                                        mt={1}
                                    >
                                        {skippedCount}
                                    </Typography>
                                </Box>
                            </Box>

                            {message && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 0,
                                        border: '1px solid #3B7D4A',
                                        backgroundColor: '#F1F7F0'
                                    }}
                                >
                                    {message}
                                </Alert>
                            )}

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 0,
                                        border: '1px solid #B85042',
                                        backgroundColor: '#FDF4F2'
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <Divider
                                sx={{
                                    borderColor: 'rgba(20, 20, 20, 0.14)',
                                    mb: 3
                                }}
                            />

                            {!loading && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    disableElevation
                                    onClick={() => navigate('/admin/questions')}
                                    endIcon={<ArrowOutwardOutlinedIcon />}
                                    sx={{
                                        backgroundColor: STUDIO_TOKENS.obsidian,
                                        color: STUDIO_TOKENS.gold,
                                        border: STUDIO_TOKENS.borderStrong,
                                        borderRadius: 0,
                                        py: 1.75,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.12em',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        '&:hover': {
                                            backgroundColor: STUDIO_TOKENS.gold,
                                            color: STUDIO_TOKENS.obsidian
                                        }
                                    }}
                                >
                                    Manage Questions
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}

export default FetchQuestions
