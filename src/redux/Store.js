
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/CounterSlice'

// Load saved data
const savedState = localStorage.getItem('quiz-platform-state')

const preloadedState = savedState
    ? JSON.parse(savedState)
    : undefined

// Create Redux Store
export const store = configureStore({
    reducer: {
        counter: counterReducer
    },
    preloadedState
})


store.subscribe(() => {
    localStorage.setItem(
        'quiz-platform-state',
        JSON.stringify(store.getState())
    )
})
