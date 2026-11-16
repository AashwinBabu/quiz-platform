
import { useState } from 'react'
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Divider,
    Stack,
    Alert
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
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

const categories = [
    { id: 9, name: 'General Knowledge' },
    { id: 17, name: 'Science & Nature' },
    { id: 21, name: 'Sports' }
]

const difficulties = ['easy', 'medium', 'hard']

function AddQuestion() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        category: 'General Knowledge',
        categoryId: 9,
        difficulty: 'easy'
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

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
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: STUDIO_TOKENS.obsidian
        }
    }

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...formData.options]
        updatedOptions[index] = value

        setFormData({
            ...formData,
            options: updatedOptions,
            correctAnswer: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        const cleanedOptions = formData.options.map(option =>
            option.trim()
        )

        const cleanedAnswer = formData.correctAnswer.trim()

        if (
            !formData.question.trim() ||
            cleanedOptions.some(option => !option) ||
            !cleanedAnswer ||
            !formData.category
        ) {
            setMessage('Please fill in all fields.')
            return
        }

        if (!cleanedOptions.includes(cleanedAnswer)) {
            setMessage('Correct answer must match one of the four options.')
            return
        }

        setLoading(true)

        try {
            const response = await AxiosConfig.get('/questions')

            const exists = response.data.some(
                item =>
                    item.question.trim().toLowerCase() ===
                    formData.question.trim().toLowerCase()
            )

            if (exists) {
                setMessage('This question already exists.')
                return
            }

            await AxiosConfig.post('/questions', {
                question: formData.question.trim(),
                options: cleanedOptions,
                correctAnswer: cleanedAnswer,
                category: formData.category,
                categoryId: formData.categoryId,
                difficulty: formData.difficulty,
                source: 'admin'
            })

            navigate('/admin/questions')
        } catch {
            setMessage('Unable to save question. Please check JSON Server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: STUDIO_TOKENS.canvas,
                color: STUDIO_TOKENS.textPrimary,
                display: 'flex',
                flexDirection: 'column'
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
                    gap: 2
                }}
            >
                <Button
                    component={Link}
                    to="/admin/questions"
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
                    Back to Questions
                </Button>

                <Typography
                    sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: STUDIO_TOKENS.textSecondary,
                        textAlign: 'right'
                    }}
                >
                    ADMIN PANEL // 01
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    px: { xs: 2, sm: 4 },
                    py: { xs: 4, md: 6 }
                }}
            >
                <Box sx={{ maxWidth: 760, mx: 'auto' }}>
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
                                Question Management
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
                            Add New{' '}
                            <Box
                                component="span"
                                sx={{ color: STUDIO_TOKENS.goldMuted }}
                            >
                                Question.
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
                            Create and add a new question to your QuizUp question bank.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: STUDIO_TOKENS.surface,
                            border: STUDIO_TOKENS.borderStrong,
                            p: { xs: 2.5, sm: 4.5 }
                        }}
                    >
                        <Box mb={3}>
                            <Typography
                                sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: STUDIO_TOKENS.goldMuted,
                                    mb: 1
                                }}
                            >
                                QUESTION DETAILS
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={800}
                                color={STUDIO_TOKENS.obsidian}
                            >
                                Question Information
                            </Typography>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(20, 20, 20, 0.12)', mb: 3 }} />

                        <Box component="form" onSubmit={handleSubmit}>
                            <Typography
                                sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                    color: STUDIO_TOKENS.obsidian
                                }}
                            >
                                Question
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Enter your question"
                                value={formData.question}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        question: e.target.value
                                    })
                                }
                                sx={inputSx}
                            />

                            <Typography
                                sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    mb: 2,
                                    color: STUDIO_TOKENS.obsidian
                                }}
                            >
                                Answer Options
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: '1fr 1fr'
                                    },
                                    gap: { xs: 0, sm: 2 }
                                }}
                            >
                                {formData.options.map((option, index) => (
                                    <TextField
                                        key={index}
                                        fullWidth
                                        label={`Option ${index + 1}`}
                                        placeholder={`Enter option ${index + 1}`}
                                        value={option}
                                        onChange={e =>
                                            handleOptionChange(index, e.target.value)
                                        }
                                        sx={inputSx}
                                    />
                                ))}
                            </Box>

                            <Divider sx={{ borderColor: 'rgba(20, 20, 20, 0.12)', mb: 3 }} />

                            <Typography
                                sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                    color: STUDIO_TOKENS.obsidian
                                }}
                            >
                                Correct Answer
                            </Typography>

                            <TextField
                                select
                                fullWidth
                                label="Select Correct Answer"
                                value={formData.correctAnswer}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        correctAnswer: e.target.value
                                    })
                                }
                                sx={inputSx}
                            >
                                {formData.options.map((option, index) => (
                                    <MenuItem
                                        key={index}
                                        value={option}
                                        disabled={!option.trim()}
                                    >
                                        {option || `Option ${index + 1}`}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Typography
                                sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                    color: STUDIO_TOKENS.obsidian
                                }}
                            >
                                Category
                            </Typography>

                            <TextField
                                select
                                fullWidth
                                value={formData.category}
                                onChange={e => {
                                    const selectedCategory = categories.find(
                                        category => category.name === e.target.value
                                    )

                                    setFormData({
                                        ...formData,
                                        category: selectedCategory.name,
                                        categoryId: selectedCategory.id
                                    })
                                }}
                                sx={inputSx}
                            >
                                {categories.map(category => (
                                    <MenuItem key={category.id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Typography
                                sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    mb: 1,
                                    color: STUDIO_TOKENS.obsidian
                                }}
                            >
                                Difficulty
                            </Typography>

                            <TextField
                                select
                                fullWidth
                                value={formData.difficulty}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        difficulty: e.target.value
                                    })
                                }
                                sx={inputSx}
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

                            {message && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 0,
                                        border: '1px solid #B85042',
                                        backgroundColor: '#FDF4F2',
                                        color: '#8F2D21'
                                    }}
                                >
                                    {message}
                                </Alert>
                            )}

                            <Divider sx={{ borderColor: 'rgba(20, 20, 20, 0.12)', mb: 3 }} />

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                            >
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disableElevation
                                    disabled={loading}
                                    endIcon={!loading && <ArrowOutwardOutlinedIcon />}
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
                                        },
                                        '&.Mui-disabled': {
                                            backgroundColor: 'rgba(20, 20, 20, 0.2)',
                                            color: 'rgba(20, 20, 20, 0.5)'
                                        }
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save Question'}
                                </Button>

                                <Button
                                    component={Link}
                                    to="/admin/questions"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        color: STUDIO_TOKENS.obsidian,
                                        border: STUDIO_TOKENS.borderStrong,
                                        borderRadius: 0,
                                        py: 1.75,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.12em',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        '&:hover': {
                                            backgroundColor: 'rgba(20, 20, 20, 0.05)',
                                            borderColor: STUDIO_TOKENS.obsidian
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default AddQuestion
