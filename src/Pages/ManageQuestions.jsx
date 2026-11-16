
import { useEffect, useMemo, useState } from 'react'
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Pagination,
    Divider
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import { Link } from 'react-router-dom'
import AxiosConfig from '../services/AxiosConfig'

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

const fieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 0,
        backgroundColor: STUDIO_TOKENS.surface,
        '& fieldset': {
            borderColor: 'rgba(20, 20, 20, 0.2)'
        },
        '&:hover fieldset': {
            borderColor: STUDIO_TOKENS.obsidian
        },
        '&.Mui-focused fieldset': {
            borderColor: STUDIO_TOKENS.goldMuted
        }
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: STUDIO_TOKENS.obsidian
    }
}

const primaryButtonStyles = {
    backgroundColor: STUDIO_TOKENS.obsidian,
    color: STUDIO_TOKENS.gold,
    border: STUDIO_TOKENS.borderStrong,
    borderRadius: 0,
    px: 2.5,
    py: 1.2,
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    '&:hover': {
        backgroundColor: STUDIO_TOKENS.gold,
        color: STUDIO_TOKENS.obsidian
    }
}

const secondaryButtonStyles = {
    color: STUDIO_TOKENS.obsidian,
    borderRadius: 0,
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    '&:hover': {
        backgroundColor: 'rgba(20, 20, 20, 0.06)'
    }
}

function ManageQuestions() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editOpen, setEditOpen] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [saving, setSaving] = useState(false)

    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [difficultyFilter, setDifficultyFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    const questionsPerPage = 5

    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        category: 'General Knowledge',
        categoryId: 9,
        difficulty: 'easy'
    })

    const fetchQuestions = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await AxiosConfig.get('/questions')
            setQuestions(response.data)
        } catch {
            setError('Unable to load questions. Please check JSON Server.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuestions()
    }, [])

    const filteredQuestions = useMemo(() => {
        return questions.filter((question) => {
            const searchText = search.toLowerCase().trim()

            const questionOptions = Array.isArray(question.options)
                ? question.options
                : []

            const matchesSearch =
                !searchText ||
                question.question?.toLowerCase().includes(searchText) ||
                question.category?.toLowerCase().includes(searchText) ||
                questionOptions.some((option) =>
                    String(option).toLowerCase().includes(searchText)
                )

            const selectedCategory = categories.find(
                (category) => category.id === Number(categoryFilter)
            )

            const matchesCategory =
                categoryFilter === 'all' ||
                Number(question.categoryId) === Number(categoryFilter) ||
                question.category === selectedCategory?.name

            const matchesDifficulty =
                difficultyFilter === 'all' ||
                question.difficulty?.toLowerCase() === difficultyFilter

            return matchesSearch && matchesCategory && matchesDifficulty
        })
    }, [questions, search, categoryFilter, difficultyFilter])

    const totalPages = Math.ceil(
        filteredQuestions.length / questionsPerPage
    )

    const displayedQuestions = filteredQuestions.slice(
        (currentPage - 1) * questionsPerPage,
        currentPage * questionsPerPage
    )

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages))
        }
    }, [currentPage, totalPages])

    const handleFilterChange = (setter, value) => {
        setter(value)
        setCurrentPage(1)
    }

    const handleEdit = (question) => {
        const category = categories.find(
            (item) =>
                Number(item.id) === Number(question.categoryId) ||
                item.name === question.category
        ) || categories[0]

        setSelectedQuestion(question)

        setFormData({
            question: question.question || '',
            options: Array.isArray(question.options)
                ? [...question.options]
                : ['', '', '', ''],
            correctAnswer: question.correctAnswer || '',
            category: category.name,
            categoryId: category.id,
            difficulty: question.difficulty?.toLowerCase() || 'easy'
        })

        setEditOpen(true)
    }

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...formData.options]
        updatedOptions[index] = value

        setFormData({
            ...formData,
            options: updatedOptions
        })
    }

    const handleCategoryChange = (value) => {
        const selectedCategory = categories.find(
            (category) => category.name === value
        )

        setFormData({
            ...formData,
            category: selectedCategory.name,
            categoryId: selectedCategory.id
        })
    }

    const handleUpdate = async () => {
        const cleanedOptions = formData.options.map((option) =>
            option.trim()
        )

        const cleanedAnswer = formData.correctAnswer.trim()

        if (
            !formData.question.trim() ||
            cleanedOptions.some((option) => !option) ||
            !cleanedAnswer ||
            !formData.category
        ) {
            alert('Please fill in all fields.')
            return
        }

        if (!cleanedOptions.includes(cleanedAnswer)) {
            alert('Correct answer must match one of the four options.')
            return
        }

        setSaving(true)

        try {
            await AxiosConfig.patch(
                `/questions/${selectedQuestion.id}`,
                {
                    question: formData.question.trim(),
                    options: cleanedOptions,
                    correctAnswer: cleanedAnswer,
                    category: formData.category,
                    categoryId: formData.categoryId,
                    difficulty: formData.difficulty
                }
            )

            setEditOpen(false)
            setSelectedQuestion(null)
            await fetchQuestions()
        } catch {
            alert('Unable to update question.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this question?'
        )

        if (!confirmDelete) return

        try {
            await AxiosConfig.delete(`/questions/${id}`)

            setQuestions((previous) =>
                previous.filter((question) => question.id !== id)
            )
        } catch {
            alert('Unable to delete question.')
        }
    }

    const clearFilters = () => {
        setSearch('')
        setCategoryFilter('all')
        setDifficultyFilter('all')
        setCurrentPage(1)
    }

    const closeEditDialog = () => {
        if (!saving) {
            setEditOpen(false)
        }
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
                    to="/admin/dashboard"
                    startIcon={<ArrowBackOutlinedIcon />}
                    sx={secondaryButtonStyles}
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
                    QUIZUP // ADMIN
                </Typography>
            </Box>

            <Box
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 5 },
                    py: { xs: 4, md: 6 }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexWrap: 'wrap',
                        gap: 3,
                        mb: 4
                    }}
                >
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
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
                                    color: STUDIO_TOKENS.textSecondary,
                                    textTransform: 'uppercase'
                                }}
                            >
                                Question Management
                            </Typography>
                        </Box>

                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                lineHeight: 1.1,
                                textTransform: 'uppercase'
                            }}
                        >
                            Manage
                            <Box
                                component="span"
                                sx={{ color: STUDIO_TOKENS.goldMuted }}
                            >
                                {' '}Questions.
                            </Box>
                        </Typography>

                        <Typography
                            sx={{
                                color: STUDIO_TOKENS.textSecondary,
                                mt: 1.5,
                                fontSize: '0.9rem'
                            }}
                        >
                            Add, edit, delete and manage your quiz questions.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        to="/admin/questions/add"
                        variant="contained"
                        startIcon={<AddIcon />}
                        disableElevation
                        sx={primaryButtonStyles}
                    >
                        Add Question
                    </Button>
                </Box>

                <Divider
                    sx={{
                        borderColor: 'rgba(20, 20, 20, 0.14)',
                        mb: 4
                    }}
                />

                <Box
                    sx={{
                        backgroundColor: STUDIO_TOKENS.surface,
                        border: STUDIO_TOKENS.borderStrong,
                        p: { xs: 2, md: 3 }
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={2}
                        mb={3}
                    >
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={900}
                                color={STUDIO_TOKENS.obsidian}
                            >
                                Saved Questions ({questions.length})
                            </Typography>

                            <Typography
                                color={STUDIO_TOKENS.textSecondary}
                                fontSize={13}
                                mt={0.5}
                            >
                                Showing {filteredQuestions.length} matching questions
                            </Typography>
                        </Box>

                        <Button
                            onClick={fetchQuestions}
                            disabled={loading}
                            startIcon={<RefreshIcon />}
                            sx={secondaryButtonStyles}
                        >
                            Refresh
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '2fr 1fr 1fr'
                            },
                            gap: 2,
                            mb: 3
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search questions, options or categories..."
                            value={search}
                            onChange={(e) =>
                                handleFilterChange(setSearch, e.target.value)
                            }
                            sx={fieldStyles}
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon
                                        sx={{
                                            color: STUDIO_TOKENS.textSecondary,
                                            mr: 1
                                        }}
                                    />
                                )
                            }}
                        />

                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Category"
                            value={categoryFilter}
                            onChange={(e) =>
                                handleFilterChange(
                                    setCategoryFilter,
                                    e.target.value
                                )
                            }
                            sx={fieldStyles}
                        >
                            <MenuItem value="all">All Categories</MenuItem>

                            {categories.map((category) => (
                                <MenuItem
                                    key={category.id}
                                    value={String(category.id)}
                                >
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Difficulty"
                            value={difficultyFilter}
                            onChange={(e) =>
                                handleFilterChange(
                                    setDifficultyFilter,
                                    e.target.value
                                )
                            }
                            sx={fieldStyles}
                        >
                            <MenuItem value="all">All Difficulties</MenuItem>
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="hard">Hard</MenuItem>
                        </TextField>
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                        mb={2}
                    >
                        <Typography
                            color={STUDIO_TOKENS.textSecondary}
                            fontSize={13}
                        >
                            {filteredQuestions.length} result(s) found
                        </Typography>

                        <Button
                            onClick={clearFilters}
                            sx={secondaryButtonStyles}
                        >
                            Clear Filters
                        </Button>
                    </Box>

                    <Divider
                        sx={{
                            borderColor: 'rgba(20, 20, 20, 0.14)'
                        }}
                    />

                    {loading ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            py={7}
                            gap={2}
                        >
                            <CircularProgress
                                sx={{ color: STUDIO_TOKENS.goldMuted }}
                            />

                            <Typography color={STUDIO_TOKENS.textSecondary}>
                                Loading questions...
                            </Typography>
                        </Box>
                    ) : error ? (
                        <Box textAlign="center" py={5}>
                            <Typography color="#B85042" mb={2}>
                                {error}
                            </Typography>

                            <Button
                                onClick={fetchQuestions}
                                sx={primaryButtonStyles}
                            >
                                Try Again
                            </Button>
                        </Box>
                    ) : questions.length === 0 ? (
                        <Box textAlign="center" py={7}>
                            <Typography
                                variant="h6"
                                fontWeight={900}
                                color={STUDIO_TOKENS.obsidian}
                            >
                                No Questions Available
                            </Typography>

                            <Typography
                                color={STUDIO_TOKENS.textSecondary}
                                mt={1}
                                mb={3}
                            >
                                Add your first question to get started.
                            </Typography>

                            <Button
                                component={Link}
                                to="/admin/questions/add"
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={primaryButtonStyles}
                            >
                                Add Question
                            </Button>
                        </Box>
                    ) : filteredQuestions.length === 0 ? (
                        <Box textAlign="center" py={7}>
                            <Typography
                                variant="h6"
                                fontWeight={900}
                                color={STUDIO_TOKENS.obsidian}
                            >
                                No Matching Questions
                            </Typography>

                            <Typography
                                color={STUDIO_TOKENS.textSecondary}
                                mt={1}
                            >
                                Try changing your search or filters.
                            </Typography>
                        </Box>
                    ) : (
                        displayedQuestions.map((question, index) => (
                            <Box
                                key={question.id}
                                sx={{
                                    py: { xs: 2.5, md: 3 },
                                    borderBottom: STUDIO_TOKENS.border
                                }}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    flexWrap="wrap"
                                    gap={2}
                                >
                                    <Typography
                                        fontWeight={800}
                                        fontSize={14}
                                        color={STUDIO_TOKENS.textSecondary}
                                        letterSpacing="0.04em"
                                    >
                                        QUESTION {((currentPage - 1) * questionsPerPage) + index + 1}
                                    </Typography>

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <Chip
                                            label={question.difficulty || 'Easy'}
                                            size="small"
                                            sx={{
                                                textTransform: 'capitalize',
                                                backgroundColor: STUDIO_TOKENS.gold,
                                                color: STUDIO_TOKENS.obsidian,
                                                borderRadius: 0,
                                                fontWeight: 700,
                                                fontSize: 11
                                            }}
                                        />

                                        <IconButton
                                            onClick={() => handleEdit(question)}
                                            aria-label="Edit question"
                                            sx={{
                                                color: STUDIO_TOKENS.obsidian,
                                                borderRadius: 0,
                                                '&:hover': {
                                                    backgroundColor: STUDIO_TOKENS.gold
                                                }
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleDelete(question.id)}
                                            aria-label="Delete question"
                                            sx={{
                                                color: '#B85042',
                                                borderRadius: 0,
                                                '&:hover': {
                                                    backgroundColor: '#FCE9E6'
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography
                                    fontWeight={800}
                                    color={STUDIO_TOKENS.obsidian}
                                    mt={2}
                                    fontSize={{ xs: 15, md: 16 }}
                                    lineHeight={1.6}
                                >
                                    {question.question}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            sm: 'repeat(2, 1fr)'
                                        },
                                        gap: 1.5,
                                        mt: 2
                                    }}
                                >
                                    {question.options?.map((option, optionIndex) => (
                                        <Box
                                            key={optionIndex}
                                            sx={{
                                                p: 1.5,
                                                backgroundColor:
                                                    option === question.correctAnswer
                                                        ? '#FFF8D9'
                                                        : STUDIO_TOKENS.canvas,
                                                border: option === question.correctAnswer
                                                    ? '1px solid #D9A71C'
                                                    : STUDIO_TOKENS.border
                                            }}
                                        >
                                            <Typography
                                                fontSize={14}
                                                fontWeight={option === question.correctAnswer ? 700 : 500}
                                                color={STUDIO_TOKENS.obsidian}
                                                sx={{ overflowWrap: 'anywhere' }}
                                            >
                                                {String.fromCharCode(65 + optionIndex)}. {option}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    flexWrap="wrap"
                                    gap={1}
                                    mt={2}
                                >
                                    <Typography
                                        color={STUDIO_TOKENS.textSecondary}
                                        fontSize={13}
                                    >
                                        Category: {question.category || 'General'}
                                    </Typography>

                                    <Typography
                                        color="#8B6810"
                                        fontSize={13}
                                        fontWeight={700}
                                    >
                                        Correct Answer: {question.correctAnswer}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    )}

                    {!loading && !error && totalPages > 1 && (
                        <Box
                            display="flex"
                            justifyContent="center"
                            mt={4}
                            mb={1}
                        >
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(event, value) => setCurrentPage(value)}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: STUDIO_TOKENS.obsidian,
                                        borderRadius: 0
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: `${STUDIO_TOKENS.gold} !important`,
                                        color: STUDIO_TOKENS.obsidian,
                                        fontWeight: 800
                                    }
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>

            <Dialog
                open={editOpen}
                onClose={closeEditDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 0,
                        border: STUDIO_TOKENS.borderStrong,
                        backgroundColor: STUDIO_TOKENS.surface
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 900,
                        fontSize: '1.3rem',
                        color: STUDIO_TOKENS.obsidian,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        px: 3,
                        pt: 3
                    }}
                >
                    Edit Question
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 2 }}>
                    <Typography
                        fontSize={12}
                        color={STUDIO_TOKENS.textSecondary}
                        mb={1}
                    >
                        UPDATE THE QUESTION DETAILS BELOW
                    </Typography>

                    <TextField
                        fullWidth
                        label="Question"
                        value={formData.question}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                question: e.target.value
                            })
                        }
                        margin="normal"
                        multiline
                        minRows={2}
                        sx={fieldStyles}
                    />

                    {formData.options.map((option, index) => (
                        <TextField
                            key={index}
                            fullWidth
                            label={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                            }
                            margin="normal"
                            sx={fieldStyles}
                        />
                    ))}

                    <TextField
                        select
                        fullWidth
                        label="Correct Answer"
                        value={formData.correctAnswer}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                correctAnswer: e.target.value
                            })
                        }
                        margin="normal"
                        sx={fieldStyles}
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

                    <TextField
                        select
                        fullWidth
                        label="Category"
                        value={formData.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        margin="normal"
                        sx={fieldStyles}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Difficulty"
                        value={formData.difficulty}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                difficulty: e.target.value
                            })
                        }
                        margin="normal"
                        sx={fieldStyles}
                    >
                        {difficulties.map((difficulty) => (
                            <MenuItem key={difficulty} value={difficulty}>
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3,
                        pt: 1,
                        gap: 1
                    }}
                >
                    <Button
                        onClick={closeEditDialog}
                        disabled={saving}
                        sx={secondaryButtonStyles}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleUpdate}
                        disabled={saving}
                        variant="contained"
                        disableElevation
                        sx={primaryButtonStyles}
                    >
                        {saving ? 'Updating...' : 'Update Question'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ManageQuestions
