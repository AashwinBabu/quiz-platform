
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    CircularProgress,
    LinearProgress,
    TextField,
    MenuItem,
    Chip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AxiosConfig from '../services/AxiosConfig'

const THEME = {
    canvas: '#F9F8F6',
    surface: '#FFFFFF',
    black: '#141414',
    gold: '#F4C430',
    mutedGold: '#D9A71C',
    secondary: '#66635E',
    border: '1px solid rgba(20,20,20,0.14)'
}

const categories = [
    { id: 9, name: 'General Knowledge' },
    { id: 17, name: 'Science & Nature' },
    { id: 21, name: 'Sports' }
]

const difficulties = ['easy', 'medium', 'hard']
const QUESTIONS_PER_QUIZ = 10
const TOTAL_TIME = 600

function Quiz() {
    const navigate = useNavigate()

    const [allQuestions, setAllQuestions] = useState([])
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [quizStarted, setQuizStarted] = useState(false)
    const [message, setMessage] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('9')
    const [difficultyFilter, setDifficultyFilter] = useState('easy')
    const [stopDialogOpen, setStopDialogOpen] = useState(false)

    const submittedRef = useRef(false)

    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('currentUser') || 'null')
        } catch {
            return null
        }
    }, [])

    const selectedCategory = categories.find(
        category => category.id === Number(categoryFilter)
    )

    const currentQuestion = questions[currentIndex]

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await AxiosConfig.get('/questions')
                setAllQuestions(response.data)
            } catch {
                setMessage('Unable to load questions. Please check JSON Server.')
            } finally {
                setLoading(false)
            }
        }

        fetchQuestions()
    }, [])

    const filteredQuestions = allQuestions.filter(question => {
        const matchesCategory =
            Number(question.categoryId) === Number(categoryFilter) ||
            question.category === selectedCategory?.name

        const matchesDifficulty =
            question.difficulty?.toLowerCase() === difficultyFilter

        return (
            matchesCategory &&
            matchesDifficulty &&
            Array.isArray(question.options) &&
            question.options.length >= 2 &&
            question.correctAnswer
        )
    })

    const availableCount = filteredQuestions.length

    const startQuiz = () => {
        if (availableCount < QUESTIONS_PER_QUIZ) {
            setMessage(
                `Only ${availableCount} questions are available. You need 10 questions to start this quiz.`
            )
            return
        }

        const shuffledQuestions = [...filteredQuestions]
            .sort(() => Math.random() - 0.5)
            .slice(0, QUESTIONS_PER_QUIZ)

        setQuestions(shuffledQuestions)
        setAnswers({})
        setCurrentIndex(0)
        setTimeLeft(TOTAL_TIME)
        setMessage('')
        setSubmitting(false)
        setStopDialogOpen(false)
        submittedRef.current = false
        setQuizStarted(true)
    }

    const handleSubmit = useCallback(async () => {
        if (submittedRef.current || questions.length === 0) return

        submittedRef.current = true
        setSubmitting(true)

        const score = questions.filter(
            question => answers[question.id] === question.correctAnswer
        ).length

        const totalQuestions = questions.length
        const percentage = Math.round((score / totalQuestions) * 100)

        const attempt = {
            userId: currentUser?.id || '',
            userName: currentUser?.name || 'User',
            totalQuestions,
            score,
            percentage,
            category: selectedCategory?.name || '',
            categoryId: Number(categoryFilter),
            difficulty: difficultyFilter,
            date: new Date().toISOString()
        }

        try {
            const response = await AxiosConfig.post('/attempts', attempt)

            navigate('/result', {
                state: response.data
            })
        } catch {
            submittedRef.current = false
            setMessage('Unable to submit your result. Please try again.')
            setSubmitting(false)
        }
    }, [
        questions,
        answers,
        currentUser,
        selectedCategory,
        categoryFilter,
        difficultyFilter,
        navigate
    ])

    useEffect(() => {
        if (!quizStarted || questions.length === 0 || submittedRef.current) {
            return
        }

        const timer = setInterval(() => {
            setTimeLeft(previousTime => {
                if (previousTime <= 1) return 0
                return previousTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [quizStarted, questions.length])

    useEffect(() => {
        if (timeLeft === 0 && quizStarted && questions.length > 0) {
            handleSubmit()
        }
    }, [timeLeft, quizStarted, questions.length, handleSubmit])

    const handleAnswerChange = event => {
        if (!currentQuestion) return

        setAnswers(previousAnswers => ({
            ...previousAnswers,
            [currentQuestion.id]: event.target.value
        }))
    }

    const handleStopQuiz = () => {
        setStopDialogOpen(false)
        setQuizStarted(false)
        setQuestions([])
        setAnswers({})
        setCurrentIndex(0)
        setTimeLeft(TOTAL_TIME)
        setMessage('')
        submittedRef.current = false
        navigate('/dashboard')
    }

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60

        return `${String(minutes).padStart(2, '0')}:${String(
            remainingSeconds
        ).padStart(2, '0')}`
    }

    const answeredCount = Object.keys(answers).length

    const progress = questions.length > 0
        ? (answeredCount / questions.length) * 100
        : 0

    const timerWarning = timeLeft <= 60

    const primaryButton = {
        backgroundColor: THEME.black,
        color: THEME.gold,
        borderRadius: 0,
        px: 3,
        py: 1.3,
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        '&:hover': {
            backgroundColor: THEME.gold,
            color: THEME.black
        },
        '&:disabled': {
            backgroundColor: '#D8D6D1',
            color: '#77736D'
        }
    }

    const secondaryButton = {
        color: THEME.black,
        borderColor: THEME.black,
        borderRadius: 0,
        px: 3,
        py: 1.3,
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        '&:hover': {
            backgroundColor: THEME.gold,
            borderColor: THEME.black
        },
        '&:disabled': {
            borderColor: 'rgba(20,20,20,0.15)',
            color: '#AAA'
        }
    }

    const fieldStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            backgroundColor: THEME.surface,
            '& fieldset': {
                borderColor: 'rgba(20,20,20,0.2)'
            },
            '&:hover fieldset': {
                borderColor: THEME.black
            },
            '&.Mui-focused fieldset': {
                borderColor: THEME.black
            }
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: THEME.black
        }
    }

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: THEME.canvas
                }}
            >
                <CircularProgress sx={{ color: THEME.mutedGold }} />
            </Box>
        )
    }

    if (allQuestions.length === 0) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: THEME.canvas,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3
                }}
            >
                <Box
                    sx={{
                        backgroundColor: THEME.surface,
                        border: THEME.border,
                        p: { xs: 3, sm: 5 },
                        textAlign: 'center',
                        maxWidth: 450,
                        width: '100%'
                    }}
                >
                    <Typography variant="h5" fontWeight={900} color={THEME.black}>
                        Quiz Unavailable
                    </Typography>

                    <Typography color={THEME.secondary} mt={2}>
                        {message || 'No questions are available. Please try again later.'}
                    </Typography>

                    <Button
                        onClick={() => navigate('/dashboard')}
                        sx={{ ...primaryButton, mt: 3 }}
                    >
                        Back to Dashboard
                    </Button>
                </Box>
            </Box>
        )
    }

    if (!quizStarted) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: THEME.canvas,
                    p: { xs: 2, md: 5 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 650,
                        backgroundColor: THEME.surface,
                        border: THEME.border,
                        p: { xs: 3, md: 5 }
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={900}
                        color={THEME.black}
                        letterSpacing="-0.05em"
                    >
                        QuizUp.
                    </Typography>

                    <Divider sx={{ my: 3, borderColor: 'rgba(20,20,20,0.14)' }} />

                    <Typography
                        color={THEME.mutedGold}
                        fontWeight={900}
                        fontSize={11}
                        letterSpacing="0.18em"
                        mt={3}
                    >
                        READY TO BEGIN?
                    </Typography>

                    <Typography
                        variant="h4"
                        fontWeight={900}
                        color={THEME.black}
                        mt={1}
                        sx={{
                            letterSpacing: '-0.05em',
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                    >
                        Set up your quiz
                    </Typography>

                    <Typography color={THEME.secondary} mt={1} mb={4}>
                        Choose a category and difficulty to start your quiz.
                    </Typography>

                    <Box
                        sx={{
                            backgroundColor: THEME.canvas,
                            border: THEME.border,
                            p: 2.5,
                            mb: 3
                        }}
                    >
                        <Typography
                            color={THEME.secondary}
                            fontSize={11}
                            fontWeight={800}
                            letterSpacing="0.12em"
                        >
                            AVAILABLE QUESTIONS
                        </Typography>

                        <Typography variant="h3" fontWeight={900} color={THEME.black} mt={0.5}>
                            {availableCount}
                            <Typography component="span" fontSize={17} color={THEME.secondary}>
                                {' '}/ 10
                            </Typography>
                        </Typography>

                        <Typography color={THEME.secondary} fontSize={13}>
                            {availableCount >= 10
                                ? 'You have enough questions to start.'
                                : `You need ${10 - availableCount} more questions.`}
                        </Typography>
                    </Box>

                    <TextField
                        select
                        fullWidth
                        label="Select Category"
                        value={categoryFilter}
                        onChange={event => {
                            setCategoryFilter(event.target.value)
                            setMessage('')
                        }}
                        margin="normal"
                        sx={fieldStyle}
                    >
                        {categories.map(category => (
                            <MenuItem key={category.id} value={String(category.id)}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Select Difficulty"
                        value={difficultyFilter}
                        onChange={event => {
                            setDifficultyFilter(event.target.value)
                            setMessage('')
                        }}
                        margin="normal"
                        sx={fieldStyle}
                    >
                        {difficulties.map(difficulty => (
                            <MenuItem
                                key={difficulty}
                                value={difficulty}
                                sx={{ textTransform: 'capitalize' }}
                            >
                                {difficulty}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box display="flex" flexWrap="wrap" gap={1} mt={3}>
                        {['10 QUESTIONS', '10 MINUTES', 'MCQ QUIZ'].map(item => (
                            <Chip
                                key={item}
                                label={item}
                                sx={{
                                    backgroundColor: THEME.gold,
                                    color: THEME.black,
                                    borderRadius: 0,
                                    fontSize: 10,
                                    fontWeight: 900,
                                    letterSpacing: '0.06em'
                                }}
                            />
                        ))}
                    </Box>

                    {message && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            {message}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={availableCount < 10}
                        onClick={startQuiz}
                        sx={{ ...primaryButton, mt: 4, py: 1.7 }}
                    >
                        Start Quiz
                    </Button>

                    <Button
                        fullWidth
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            mt: 1,
                            color: THEME.secondary,
                            borderRadius: 0,
                            textTransform: 'uppercase',
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            py: 1.5,
                            '&:hover': {
                                backgroundColor: 'rgba(20,20,20,0.05)',
                                color: THEME.black
                            }
                        }}
                    >
                        Back to Dashboard
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                backgroundColor: THEME.canvas,
                p: { xs: 2, sm: 3, md: 5 },
                boxSizing: 'border-box'
            }}
        >
            <Box sx={{ maxWidth: 950, width: '100%', mx: 'auto' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 4
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h5"
                            fontWeight={900}
                            color={THEME.black}
                            letterSpacing="-0.05em"
                        >
                            QuizUp.
                        </Typography>

                        <Typography color={THEME.secondary} mt={0.5} fontSize={13}>
                            {selectedCategory?.name} · {difficultyFilter}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'stretch',
                            justifyContent: 'flex-end',
                            gap: 1.5,
                            flexWrap: 'nowrap',
                            flexShrink: 0
                        }}
                    >
                        <Button
                            variant="outlined"
                            disabled={submitting}
                            onClick={() => setStopDialogOpen(true)}
                            sx={{
                                ...secondaryButton,
                                minWidth: { xs: 105, sm: 130 },
                                whiteSpace: 'nowrap',
                                alignSelf: 'center'
                            }}
                        >
                            Stop Quiz
                        </Button>

                        <Box
                            sx={{
                                width: { xs: 125, sm: 155 },
                                minWidth: { xs: 125, sm: 155 },
                                minHeight: 76,
                                px: 1.5,
                                py: 1,
                                boxSizing: 'border-box',
                                backgroundColor: timerWarning ? '#FFF2CC' : THEME.black,
                                border: timerWarning
                                    ? '1px solid #D9A71C'
                                    : '1px solid #141414',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 0.3,
                                position: 'relative',
                                zIndex: 1,
                                overflow: 'visible'
                            }}
                        >
                            <Typography
                                component="div"
                                sx={{
                                    color: timerWarning ? THEME.black : '#FFFFFF',
                                    fontSize: 10,
                                    fontWeight: 900,
                                    letterSpacing: '0.12em',
                                    lineHeight: 1.4,
                                    display: 'block'
                                }}
                            >
                                TIME REMAINING
                            </Typography>

                            <Typography
                                component="div"
                                sx={{
                                    color: timerWarning ? THEME.black : THEME.gold,
                                    fontSize: { xs: 24, sm: 29 },
                                    fontWeight: 900,
                                    lineHeight: 1.25,
                                    fontVariantNumeric: 'tabular-nums',
                                    display: 'block'
                                }}
                            >
                                {formatTime(timeLeft)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        backgroundColor: THEME.surface,
                        border: THEME.border,
                        p: { xs: 2, md: 3 },
                        mb: 3
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                            mb: 1.5
                        }}
                    >
                        <Typography
                            fontWeight={900}
                            color={THEME.black}
                            fontSize={12}
                            letterSpacing="0.1em"
                        >
                            QUIZ PROGRESS
                        </Typography>

                        <Typography color={THEME.secondary} fontSize={12}>
                            {answeredCount} of {questions.length} answered
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 8,
                            borderRadius: 0,
                            backgroundColor: '#EAE8E2',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: THEME.gold,
                                borderRadius: 0
                            }
                        }}
                    />
                </Box>

                {currentQuestion && (
                    <Box
                        sx={{
                            backgroundColor: THEME.surface,
                            border: THEME.border,
                            p: { xs: 2.5, md: 4 }
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 1,
                                mb: 3
                            }}
                        >
                            <Typography
                                color={THEME.mutedGold}
                                fontWeight={900}
                                fontSize={11}
                                letterSpacing="0.12em"
                            >
                                QUESTION {currentIndex + 1} / {questions.length}
                            </Typography>

                            <Box display="flex" gap={1} flexWrap="wrap">
                                <Chip
                                    size="small"
                                    label={currentQuestion.category}
                                    sx={{
                                        borderRadius: 0,
                                        backgroundColor: THEME.canvas,
                                        color: THEME.black,
                                        fontWeight: 700
                                    }}
                                />

                                <Chip
                                    size="small"
                                    label={currentQuestion.difficulty}
                                    sx={{
                                        borderRadius: 0,
                                        textTransform: 'capitalize',
                                        backgroundColor: THEME.gold,
                                        color: THEME.black,
                                        fontWeight: 800
                                    }}
                                />
                            </Box>
                        </Box>

                        <Typography
                            variant="h5"
                            fontWeight={900}
                            color={THEME.black}
                            mb={4}
                            sx={{
                                lineHeight: 1.5,
                                letterSpacing: '-0.025em',
                                fontSize: { xs: '1.2rem', md: '1.5rem' }
                            }}
                        >
                            {currentQuestion.question}
                        </Typography>

                        <RadioGroup
                            value={answers[currentQuestion.id] || ''}
                            onChange={handleAnswerChange}
                        >
                            {currentQuestion.options?.map((option, index) => {
                                const selected = answers[currentQuestion.id] === option

                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            border: selected
                                                ? '1px solid #141414'
                                                : THEME.border,
                                            backgroundColor: selected
                                                ? '#FFF9E5'
                                                : THEME.surface,
                                            mb: 1.5,
                                            px: 2,
                                            py: 1,
                                            transition: '0.2s',
                                            '&:hover': {
                                                borderColor: THEME.black,
                                                backgroundColor: '#FFF9E5'
                                            }
                                        }}
                                    >
                                        <FormControlLabel
                                            value={option}
                                            control={
                                                <Radio
                                                    sx={{
                                                        color: THEME.secondary,
                                                        '&.Mui-checked': {
                                                            color: THEME.mutedGold
                                                        }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography
                                                    color={THEME.black}
                                                    fontSize={14}
                                                    fontWeight={selected ? 800 : 500}
                                                >
                                                    {String.fromCharCode(65 + index)}. {option}
                                                </Typography>
                                            }
                                            sx={{
                                                width: '100%',
                                                m: 0,
                                                py: 0.5
                                            }}
                                        />
                                    </Box>
                                )
                            })}
                        </RadioGroup>

                        <Divider sx={{ my: 3, borderColor: 'rgba(20,20,20,0.14)' }} />

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap'
                            }}
                        >
                            <Button
                                variant="outlined"
                                disabled={currentIndex === 0 || submitting}
                                onClick={() => setCurrentIndex(currentIndex - 1)}
                                sx={secondaryButton}
                            >
                                Previous
                            </Button>

                            {currentIndex < questions.length - 1 ? (
                                <Button
                                    variant="contained"
                                    disabled={submitting}
                                    onClick={() => setCurrentIndex(currentIndex + 1)}
                                    sx={primaryButton}
                                >
                                    Next Question
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                    sx={primaryButton}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}

                <Box
                    sx={{
                        backgroundColor: THEME.surface,
                        border: THEME.border,
                        p: { xs: 2, md: 3 },
                        mt: 3
                    }}
                >
                    <Typography
                        fontWeight={900}
                        color={THEME.black}
                        fontSize={12}
                        letterSpacing="0.1em"
                        mb={2}
                    >
                        NAVIGATE QUESTIONS
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 1.2,
                            alignItems: 'center'
                        }}
                    >
                        {questions.map((question, index) => {
                            const answered = answers[question.id] !== undefined
                            const active = currentIndex === index

                            return (
                                <Button
                                    key={question.id}
                                    onClick={() => setCurrentIndex(index)}
                                    disabled={submitting}
                                    sx={{
                                        minWidth: 42,
                                        width: 42,
                                        height: 42,
                                        p: 0,
                                        flex: '0 0 42px',
                                        borderRadius: 0,
                                        fontWeight: 900,
                                        backgroundColor: active
                                            ? THEME.black
                                            : answered
                                                ? THEME.gold
                                                : THEME.canvas,
                                        color: active
                                            ? THEME.gold
                                            : THEME.black,
                                        border: active
                                            ? '1px solid #141414'
                                            : THEME.border,
                                        '&:hover': {
                                            backgroundColor: THEME.gold,
                                            color: THEME.black
                                        }
                                    }}
                                >
                                    {index + 1}
                                </Button>
                            )
                        })}
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(3, max-content)'
                            },
                            columnGap: 3,
                            rowGap: 1.5,
                            mt: 3,
                            alignItems: 'center'
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box
                                sx={{
                                    width: 13,
                                    height: 13,
                                    flexShrink: 0,
                                    backgroundColor: THEME.black
                                }}
                            />
                            <Typography fontSize={12} color={THEME.secondary}>
                                Current
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Box
                                sx={{
                                    width: 13,
                                    height: 13,
                                    flexShrink: 0,
                                    backgroundColor: THEME.gold,
                                    border: THEME.border
                                }}
                            />
                            <Typography fontSize={12} color={THEME.secondary}>
                                Answered
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Box
                                sx={{
                                    width: 13,
                                    height: 13,
                                    flexShrink: 0,
                                    backgroundColor: THEME.canvas,
                                    border: THEME.border
                                }}
                            />
                            <Typography fontSize={12} color={THEME.secondary}>
                                Not answered
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {message && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                )}
            </Box>

            <Dialog
                open={stopDialogOpen}
                onClose={() => setStopDialogOpen(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 0,
                        border: THEME.border,
                        backgroundColor: THEME.surface
                    }
                }}
            >
                <DialogTitle fontWeight={900} color={THEME.black}>
                    Stop this quiz?
                </DialogTitle>

                <DialogContent>
                    <Typography color={THEME.secondary} fontSize={14}>
                        Are you sure you want to stop this quiz? Your answers
                        will not be saved and no attempt will be recorded.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 1, flexWrap: 'wrap' }}>
                    <Button
                        onClick={() => setStopDialogOpen(false)}
                        sx={{
                            color: THEME.secondary,
                            borderRadius: 0,
                            fontWeight: 800,
                            fontSize: 11,
                            textTransform: 'uppercase'
                        }}
                    >
                        Continue Quiz
                    </Button>

                    <Button
                        onClick={handleStopQuiz}
                        variant="contained"
                        sx={primaryButton}
                    >
                        Yes, Stop Quiz
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Quiz
